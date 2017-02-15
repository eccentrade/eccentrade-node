export default class Portfolios {

  constructor(client) {
    this.client = client;
  }

  /**
   * List all portfolios for the authenticated user.
   *
   * @param {object} params
   * @param {function} cb
   *
   * @returns {Promise}
   */
  list(params, cb) {
    return this.client.get('user/portfolios', params, cb);
  }

  /**
   * Get a portfolio for the authenticated user.
   *
   * @param {string} portfolioId
   * @param {object} params
   * @param {function} cb
   *
   * @returns {Promise}
   */
  get(portfolioId, params, cb) {
    return this.client.get(`user/portfolios/${portfolioId}`, params, cb);
  }

  /**
   * Create a new portfolio for the authenticated user.
   *
   * @param {object} body The portfolio to create.
   * @param {function} cb The callback with two parameters, errror and the newly created portfolio.
   *
   * @returns {Promise}
   */
  create(body, cb) {
    return this.client.post('user/portfolios', body, cb);
  }

  /**
   * Update a new portfolio for the authenticated user.
   *
   * @param {string} portfolioId The portfolio ID.
   * @param {object} body The fields to update.
   * @param {function} cb The callback with two parameters, error and the updated portfolio.
   *
   * @returns {Promise}
   */
  update(portfolioId, body, cb) {
    return this.client.patch(`user/portfolios/${portfolioId}`, body, cb);
  }

  /**
   * Delete a portfolio for the authenticated user.
   *
   * @param {string} portfolioId The portfolio ID.
   * @param {function} cb A callback with one error parameter.
   *
   * @returns {Promise}
   */
  delete(portfolioId, cb) {
    return this.client.delete(`user/portfolios/${portfolioId}`, cb);
  }

  /**
   * Get companies info for a portfolio for the authenticated user.
   * TODO Merge with get above.
   *
   * @param {string} portfolioId
   * @param {object} params
   * @param {function} cb
   *
   * @returns {Promise}
   */
  getCompanies(portfolioId, params, cb) {
    return this.client.get(`user/portfolios/${portfolioId}/companies`, params, cb);
  }

  /**
   * Add companies to a portfolio for the authenticated user.
   *
   * @param {string} portfolioId The portfolio ID to add the company to.
   * @param {array} guids The GUIDs of the companies to add.
   * @param {function} cb The callback with one error parameter.
   * 
   * @returns {Promise}
   */
  addCompanies(portfolioId, guids, cb) {
    return this.client.post(`user/portfolios/${portfolioId}/companies`, { guids }, cb);
  }

  /**
   * Remove companies from a portfolio for the authenticated user.
   *
   * @param {string} portfolioId The portfolio ID.
   * @param {array} guids The GUIDs of the companies to remove.
   * @param {function} cb A callback with one error parameter.
   * 
   * @returns {Promise}
   */
  removeCompanies(portfolioId, guids, cb) {
    return this.client.delete(`user/portfolios/${portfolioId}/companies`, { guids }, cb);
  }

  /**
   * Update the triggers that apply to a portfolio for the authenticated user.
   *
   * @param {string} portfolioId The portfolio ID.
   * @param {object} triggers The new triggers.
   * @param {function} cb An optional callback with two parameters, error and the result.
   *
   * @returns {Promise}
   */
  updateTriggers(portfolioId, triggers, cb) {
    return this.client.post(`user/portfolios/${portfolioId}/triggers`, triggers, cb);
  }

  /**
   * Update the alert settings for a portfolio for the authenticated user.
   *
   * @param {string} portfolioId The portfolio ID.
   * @param {object} alert The new alert details.
   * @param {function} cb An optional callback with two parameters, error and the result.
   *
   * @returns {Promise}
   */
  updateAlert(portfolioId, alert, cb) {
    return this.client.post(`user/portfolios/${portfolioId}/alert`, alert, cb);
  }

}
