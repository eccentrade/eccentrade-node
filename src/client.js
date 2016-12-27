import { merge } from 'lodash';
import request from 'request';
import Promise from 'bluebird';

import Accounts from './resources/accounts';
import Companies from './resources/companies';
import Search from './resources/search';

export default class Client {
  constructor(options) {
    if (!options) {
      console.log('Missing Eccentrade API client configuration settings.');
    }
    this.baseUrl = options.url || 'https://api.eccentrade.com';
    this.appId = options.appId;
    this.username = options.email;
    this.password = options.password;

    this.accounts = new Accounts(this);
    this.companies = new Companies(this);
    this.search = new Search(this);
  }

  /**
   * Execute a raw API request.
   * 
   * @param {string} resource The resource to request.
   * @param {object}options The options object to form the request object.
   * @returns
   * 
   * @memberOf Client
   */
  call(method = 'GET', resource, options, cb) {
    const defaults = {
      json: true,
      headers: {
        'User-Agent': 'eccentrade-node-client/1.0.0',
      },
    };
    const payload = merge(defaults, options);
    payload.method = method;
    if (this.token) {
      payload.headers['Authorization'] = `Bearer ${this.token}`;
    }
    payload.url = `${this.baseUrl}/${resource}`;

    request(payload, (error, response) => {
      if (error) {
        return cb(new Error(error));
      } else if (response.statusCode !== 200) {
        if (response.statusCode === 401) {
          // Auth and retry
          this.authorize(() => {
            request(payload, (error, response) => {
              //console.log(error, response);
              if (error) {
                return cb(new Error(JSON.stringify(error)));
              } else if (response.statusCode !== 200) {
                return cb(new Error(JSON.stringify(response.body)));
              } else {
                return cb(null, response.body);
              }
            });
          });
        } else {
          return cb(new Error(JSON.stringify(response.body)));
        }
      } else {
        return cb(null, response.body);
      }
    });
  }

    /**
   * Shortcut for doing a GET request.
   * 
   * @param {string} resource
   * @param {object} data The data object with query parameters to for the request.
   * @returns
   * 
   * @memberOf Client
   */
  get(resource, body, cb = () => {}) {
    // return new Promise((resolve, reject) => {
      this.call('GET', resource, {
        qs: body,
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
   * @param {object} data The data object to form the request body.
   * @returns
   * 
   * @memberOf Client
   */
  post(resource, body, cb = () => {}) {
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
   * @param {object} data The data object to form the request body.
   * @returns
   * 
   * @memberOf Client
   */
  patch(resource, body, cb = () => {}) {
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
   * @param {object} data The data object to form the request body.
   * @returns
   * 
   * @memberOf Client
   */
  delete(resource, body, cb = () => {}) {
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
