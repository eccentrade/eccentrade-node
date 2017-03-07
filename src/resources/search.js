import { assignIn } from 'lodash';

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
    return this.client.get('search/companies', assignIn({}, { q: query }, filter, options), cb);
  }
}

