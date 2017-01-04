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
    this.token = options.token;

    // Deprecated login
    this.appId = options.appId;
    this.username = options.email;
    this.password = options.password;

    this.accounts = new Accounts(this);
    this.auth = new Auth(this);
    this.companies = new Companies(this);
    this.search = new Search(this);
    this.users = new Users(this);
  }

  /**
   * Execute a raw API request.
   * 
   * @param {string} resource The resource to request.
   * @param {object} options The options object to form the request object.
   * @returns
   * 
   * @memberOf Client
   */
  call(method = 'GET', resource, options, cb = () => {}) {
    const self = this;

    /**
     * Transparently authorizes a client.
     */
    function auth(response) {
      return new Promise((resolve, reject) => {
        if (response.status === 401) {
          self.auth.login(this.username, this.password, (error, result) => {
            if (error) reject(error);
            self.token = result.token;
            resolve(response);
          });
        } else {
          resolve(response);
        }
      });
    }

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
    if (this.token) {
      payload.headers['Authorization'] = `Bearer ${this.token}`;
    }

    fetch(url, payload)
    .then(auth)
    .then((response) => {
      return response.json();
    }).then((json) => {
      console.log(json);
      return cb(null, json);
    }).catch((error) => {
      return cb(new Error(JSON.stringify(error)));
    });
      // if (response.statusCode === 401) {
      //   this.authorize(() => {
      //     fetch(payload).then((response) => {
      //       if (response.statusCode !== 200) {
      //         return cb(new Error(JSON.stringify(response.body)));
      //       } else {
      //         return cb(null, response.json());
      //       }
      //     }).catch((error) => {
      //       return cb(new Error(JSON.stringify(error)));
      //     });
      //   });
      // } else {
      //   return cb(null, response.json());
      // }
  }

    /**
   * Shortcut for doing a GET request.
   * 
   * @param {string} resource
   * @param {object} params Optional query parameters.
   * @returns
   * 
   * @memberOf Client
   */
  get(resource, params, cb) {
    this.call('GET', resource, {
      params,
    }, (error, result) => {
      if (error) {
        cb(error);
      } else {
        cb(null, result);
      }
    });
  }

  /**
   * Shortcut for doing a POST request.
   * 
   * @param {string} resource The resource to request.
   * @param {object} body The data object to form the request body.
   * @returns
   * 
   * @memberOf Client
   */
  post(resource, body, cb) {
    this.call('POST', resource, {
      body,
    }, (error, result) => {
      if (error) {
        cb(error);
      } else {
        cb(null, result);
      }
    });
  }

  /**
   * Shortcut for doing a PATCH request.
   * 
   * @param {string} resource The resource to request.
   * @param {object} body The data object to form the request body.
   * @returns
   * 
   * @memberOf Client
   */
  patch(resource, body, cb) {
    this.call('PATCH', resource, {
      body,
    }, (error, result) => {
      if (error) {
        cb(error);
      } else {
        cb(null, result);
      }
    });
  }

  /**
   * Shortcut for doing a DELETE request.
   * 
   * @param {string} resource The resource to request.
   * @param {object} body The data object to form the request body.
   * @returns
   * 
   * @memberOf Client
   */
  delete(resource, body, cb) {
    this.call('DELETE', resource, {
      body,
    }, (error, result) => {
      if (error) {
        cb(error);
      } else {
        cb(null, result);
      }
    });
  }

  authorize(cb) {
    this.accounts.login(this.username, this.password, (error, result) => {
      if (error) {
        return cb(error);
      }
      this.token = result.token;
      cb(null, true);
    });
  }

}
