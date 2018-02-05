import { merge } from 'lodash';
import EventEmitter from 'events';
import Promise from 'es6-promise';
import 'isomorphic-fetch';

import Accounts from './resources/accounts';
import Applications from './resources/applications';
import Auth from './resources/auth';
import Companies from './resources/companies';
import Portfolios from './resources/portfolios';
import Search from './resources/search';
import User from './resources/user';
import Users from './resources/users';

// Polyfill for older browsers.
Promise.polyfill();

/**
 * Converts an object with strings and arrays to a query parameter string.
 * 
 * @param {object} obj The query parameter object.
 */
function convertObjectToUrlParameterString(obj) {
  const str = Object.keys(obj).map((i) => {
    if (Array.isArray(obj[i])) {
      return obj[i].map(j => `${i}=${j}`).join('&');
    } else {
      return `${i}=${obj[i]}`;
    }
  }).join('&');
  return `?${str}`;
}

/**
 * Adds timeout functionality the whatwg-fetch polyfill is missing.
 *
 * @param {number} ms Milliseconds until the timeout.
 * @param {Promise} promise The Promise object to chain.
 */
function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(function () {
      reject(new Error('ECONNTIMEOUT'));
    }, ms);
    promise
      .then(resolve, reject)
      .catch(reject)
      .then(() => clearTimeout(timer));
  });
}

export default class Client {
  constructor(options) {
    if (!options || !options.appId) {
      console.log('Missing Eccentrade API client configuration settings.');
    }

    this.baseUrl = options.url || 'https://api.eccentrade.com';
    this.appId = options.appId;

    this.refreshToken = options.token; // New token init.
    this.username = options.email; // Deprecated init.
    this.password = options.password; // Deprecated

    this.timeout = options.timeout || 30000; // Optional request timeout (ms).

    this.accounts = new Accounts(this);
    this.applications = new Applications(this);
    this.auth = new Auth(this);
    this.companies = new Companies(this);
    this.portfolios = new Portfolios(this);
    this.search = new Search(this);
    this.user = new User(this);
    this.users = new Users(this);

    this.events = new EventEmitter();
  }

  /**
   * Wraps the original fetch with transparent auth and retry.
   * 
   * @param {number} n The number of retries for the call in case of network issues.
   * @param {string} url The request URL.
   * @param {object} payload The fetch payload.
   * @param {function} cb Optional callback.
   *
   * @returns Promise
   */
  fetch(n, url, payload, cb) {
    // In case the token got refreshed.
    if (this.token) {
      payload.headers['Authorization'] = `Bearer ${this.token}`;
    }
    return new Promise((resolve, reject) => {
      fetch(url, payload)
        .then((response) => {
          console.log(n, response.ok, response.status);
          if (response.ok) {
            // A 204 without body will cause a json parsing exception.
            if (response.status === 204) {
              return {};
            }
            const body = response.json();
            if (!body) {
              return {};
            }
            return body.then((result) => {
              return result;
            });
          }
          // If the current call returned 401 Unauthorized, and it is not a failed authorization call.
          if (response.status === 401 && response.url.indexOf('auth') === -1 && this.refreshToken) {
            // Transparently retry the request by refreshing the access token.
            return this.auth.refresh(this.refreshToken)
              .then((result) => {
                this.token = result.token;
                this.events.emit('authorized', result);
                // Retry the original fetch.
                return this.fetch(n, url, payload, cb);
              })
              .catch((error) => { // By here the refresh failed. Reject.
                cb(error);
                return reject(error);
              });
          } else if (response.status !== 401) {
            return reject({ statusCode: response.status, error: response.statusText });
          } else if (n > 0) {
            return this.fetch(n - 1, url, payload, cb);
          }
          throw new Error('Maximum retry count exceeded.');
        })
        .then((result) => {
          cb(null, result);
          return resolve(result);
        })
        .catch((error) => {
          cb(error);
          return reject(error);
        });
    });
  };

  /**
   * Execute a raw API request. Checks for 401 unauthorized and retries automatically.
   * Supports both promise and traditional callbacks.
   *
   * @param {string} resource The resource to request.
   * @param {object} options The options object to form the request object.
   * @param {object} options.params Query parameters.
   * @returns
   */
  call(method = 'GET', resource, options, cb = () => {}) {
    const defaults = {
      headers: {
        'Content-Type': 'application/json',
        // 'User-Agent': '', // throws an error in Safari
      },
      timeout: this.timeout,
    };
    let url = `${this.baseUrl}/${resource}`;
    if (options.params && method === 'GET') {
      const urlParameters = convertObjectToUrlParameterString(options.params);
      url += urlParameters;
    }
    if (options.body) {
      options.body = JSON.stringify(options.body);
    }
    const payload = merge(defaults, options);
    payload.method = method;

    return timeout(this.timeout, this.fetch(1, url, payload, cb));
  }

    /**
   * Shortcut for doing a GET request.
   *
   * @param {string} resource
   * @param {object} params Optional query parameters.
   * @returns
   */
  get(resource, params = null, cb) {
    return this.call('GET', resource, {
      params,
    }, cb);
  }

  /**
   * Shortcut for doing a POST request.
   *
   * @param {string} resource The resource to request.
   * @param {object} body The data object to form the request body.
   * @returns
   */
  post(resource, body, cb) {
    return this.call('POST', resource, {
      body,
    }, cb);
  }

  /**
   * Shortcut for doing a PATCH request.
   *
   * @param {string} resource The resource to request.
   * @param {object} body The data object to form the request body.
   * @returns
   */
  patch(resource, body, cb) {
    return this.call('PATCH', resource, {
      body,
    }, cb);
  }

  /**
   * Shortcut for doing a DELETE request.
   *
   * @param {string} resource The resource to request.
   * @param {object} body The data object to form the request body.
   * @returns
   */
  delete(resource, body, cb) {
    return this.call('DELETE', resource, {
      body,
    }, cb);
  }

  /**
   * Authorizes a client by logging in and storing the token for subsequent calls.
   */
  authorize(cb = () => {}) {
    return this.auth.login(this.username, this.password, (error, result) => {
      if (error) {
        return cb(error);
      }
      this.setTokens(result);
      this.events.emit('authorized', result);
      return cb(null, true);
    });
  }

  /**
   * Updates the tokens that are used to authorize requests.
   *
   * @param {object} values
   */
  setTokens(values) {
    this.token = values.token;
    this.refreshToken = values.refreshToken;
  }

}
