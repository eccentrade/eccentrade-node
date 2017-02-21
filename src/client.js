import { merge } from 'lodash';
import EventEmitter from 'events';
import Promise from 'es6-promise';
import 'isomorphic-fetch';

import Accounts from './resources/accounts';
import Auth from './resources/auth';
import Companies from './resources/companies';
import Portfolios from './resources/portfolios';
import Search from './resources/search';
import User from './resources/user';
import Users from './resources/users';

// Polyfill for older browsers.
Promise.polyfill();

export default class Client {
  constructor(options) {
    if (!options) {
      console.log('Missing Eccentrade API client configuration settings.');
    }

    this.baseUrl = options.url || 'https://api.eccentrade.com';
    this.appId = options.appId;
    this.token = options.token;
    this.refreshToken = options.refreshToken;
    this.expiresIn = options.expiresIn;

    this.username = options.email; // Deprecated
    this.password = options.password; // Deprecated

    this.accounts = new Accounts(this);
    this.auth = new Auth(this);
    this.companies = new Companies(this);
    this.portfolios = new Portfolios(this);
    this.search = new Search(this);
    this.user = new User(this);
    this.users = new Users(this);

    this.events = new EventEmitter();
  }

  /**
   * Execute a raw API request. Checks for 401 unauthorized and retries automatically.
   * Supports both promise and traditional callbacks.
   *
   * @param {string} resource The resource to request.
   * @param {object} options The options object to form the request object.
   * @param {object} options.params Query parameters 
   * @returns
   */
  call(method = 'GET', resource, options, cb = () => {}) {
    const self = this;
    let rs, rj;

    let url = `${this.baseUrl}/${resource}`;
    if (options.params && method === 'GET') {
      const urlParameters = Object.keys(options.params).map(i => `${i}=${options.params[i]}`).join('&');
      url += `?${urlParameters}`;
    }
    if (options.body) {
      options.body = JSON.stringify(options.body);
    }
    const payload = merge({
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'eccentrade-client/1.0.0',
      },
      //mode: 'cors',
    }, options);
    payload.method = method;

    function handle(response) {
      if (response.ok) {
        if (response.status === 204) { // Empty body
          return null;
        }
        return response.json();
      }
      // If the current call returned 401 Unauthorized, and it is not a failed login call,
      if (response.status === 401 && resource !== 'auth/login' && self.refreshToken) {
        // Transparently retry the request by refreshing the access token.
        return self.auth.refresh(self.refreshToken)
          .then((result) => {
            self.token = result.token;
            self.events.emit('authorized', result);
            throw response.json();
          })
          .catch((error) => { // By here the refresh failed. Reject.
            cb(error);
            return rj(error);
          });
      }
      throw response.json();
    }

    return new Promise((resolve, reject) => {
      rs = resolve;
      rj = reject;

      const authorizedFetch = (n) => {
        if (this.token) {
          payload.headers['Authorization'] = `Bearer ${this.token}`;
        }
        fetch(url, payload)
          .then(handle)
          .then((result) => {
            console.log('result', result);
            cb(null, result);
            return resolve(result);
          })
          .catch((response) => {
            console.log('catch', response);
            if (n > 0) {
              return authorizedFetch(n - 1);
            } else {
              return Promise.resolve(response).then((error) => {
                cb(error);
                return reject(error);
              });
            }
          });
      };
      authorizedFetch(0); // Number of retries
    });
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
        cb(error);
      }
      this.token = result.token;
      this.refreshToken = result.refreshToken;
      this.expiresIn = result.expiresIn;
      cb(null, true);
      events.emit('authorized', result);
    });
  }

}
