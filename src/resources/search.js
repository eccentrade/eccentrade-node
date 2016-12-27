export default class Search {

  constructor(client) {
    this.client = client;
  }

  /**
   * Search for companies.
   * 
   * @param {string} query An ElasticSearch compatible simple query string
   * @param {object} options
   * @param {number} options.skip The number of results to skip.
   * @param {number} options.limit The result limit.
   * @param {function} cb The callback with two parameters, error and the search results.
   * 
   * @returns
   * 
   * @memberOf Search
   */
  companies(query, options, cb) {
    return this.client.get('search/companies', {
      q: query,
      skip: options.skip || 0,
      limit: options.limit || 50,
    }, cb);
  }
}

