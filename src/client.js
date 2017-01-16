import { merge } from 'lodash';
import Promise from 'es6-promise';
import 'isomorphic-fetch';

import Accounts from './resources/accounts';
import Auth from './resources/auth';
import Companies from './resources/companies';
import Search from './resources/search';
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
    this.search = new Search(this);
    this.users = new Users(this);
  }

  /**
   * Execute a raw API request. Checks for 401 unauthorized and retries automatically.
   * 
   * @param {string} resource The resource to request.
   * @param {object} options The options object to form the request object.
   * @returns
   */
  call(method = 'GET', resource, options, cb = () => {}) {
    const self = this;

    let url = `${this.baseUrl}/${resource}`;
    if (options.params) {
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
    }, options);
    payload.method = method;

    return new Promise((resolve, reject) => {
      const authorizedFetch = (retry = false) => {
        if (this.token) {
          payload.headers['Authorization'] = `Bearer ${this.token}`;
        }
        fetch(url, payload)
          .then((response) => {
            if (response.status === 401) {
              // Transparently try to authorize and retry the request by throwing an error.
              return self.auth.refresh(self.refreshToken)
                .then((result) => {
                  self.token = result.token;
                  Hook.call('onTokenRefresh', result.token);
                  throw response.status;
                });
            }
            return response.json();
          })
          .then((result) => {
            cb(null, result);
            return resolve(result);
          })
          .catch((error) => {
            if (!retry) {
              return authorizedFetch(true);
            } else {
              cb(error);
              return reject(error);
            }
          });
      };
      authorizedFetch();
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
    });
  }

}
