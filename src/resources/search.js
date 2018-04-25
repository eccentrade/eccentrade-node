import { assignIn } from 'lodash';

const debug = require('debug')('client-search');

export default class Search {

  constructor(client) {
    this.client = client;
  }

  /**
   * Search for companies.
   * 
   * @param {string} query An ElasticSearch compatible simple query string
   * @param {object} filter A filter object to narrow down search results on.
   * @param {object} options Search options.
   * @param {number} options.skip Pagination offset.
   * @param {number} options.limit Pagination limit.
   * @param {function} cb The callback with two parameters, error and the search results.
   * 
   * @returns Promise
   * 
   * @memberOf Search
   */
  companies(query, filter, options, cb) {
    let params = assignIn({}, filter, options);
    if (query) {
      params = assignIn(params, { q: query });
    }
    debug(params);
    return this.client.get('search/companies', params, cb);
  }
}

