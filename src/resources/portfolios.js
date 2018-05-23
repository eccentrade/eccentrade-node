import Triggers from './portfolios/triggers';

export default class Portfolios {

  constructor(client) {
    this.client = client;
    this.triggers = new Triggers(this.client);
  }

  /**
   * List portfolio resources.
   *
   * @param {object} params Query parameters.
   * @param {function} cb The callback with two parameters, error and an array of portfolio resources.
   * @returns
   */
  list(params, cb) {
    return this.client.get('portfolios', params, cb);
  }

  /**
   * Get a portfolio resource.
   *
   * @param {string} portfolioId The ID of the portfolio.
   * @param {function} cb The callback with two parameters, errror and portfolio.
   * @returns
   */
  get(portfolioId, params, cb) {
    return this.client.get(`portfolios/${portfolioId}`, params, cb);
  }

  /**
   * Create a new portfolio resource.
   *
   * @param {object} body The portfolio document to create.
   * @param {function} cb The callback with two parameters, errror and the newly created portfolio.
   * @returns
   */
  create(body, cb) {
    return this.client.post('portfolios', body, cb);
  }

  /**
   * Update a single portfolio resource.
   *
   * @param {string} portfolioId The ID of the portfolio.
   * @param {object} body The fields to update.
   * @param {function} cb The callback with two parameters, errror and the updated portfolio.
   * @returns
   */
  update(portfolioId, body, cb) {
    this.client.patch(`portfolios/${portfolioId}`, body, cb);
  }

  /**
   * Delete a single portfolio resource.
   *
   * @param {string} portfolioId The ID of the portfolio.
   * @param {function} cb A callback with one error parameter.
   * @returns
   */
  delete(portfolioId, cb) {
    return this.client.delete(`portfolios/${portfolioId}`, null, cb);
  }
}
