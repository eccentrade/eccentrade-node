export default class Companies {

  constructor(client) {
    this.client = client;
  }

  /**
   * Get a company resource.
   *
   * @param {string} guid The Global Unique ID of the company.
   * @param {function} cb The callback with two parameters, errror and company.
   * @returns
   */
  get(guid, params, cb) {
    return this.client.get(`companies/${guid}`, params, cb);
  }

  /**
   * Create a new company resource.
   *
   * @param {object} body The company document to create.
   * @param {function} cb The callback with two parameters, errror and the newly created company.
   * @returns
   */
  create(body, cb) {
    return this.client.post('companies', body, cb);
  }

  /**
   * Update a single company resource.
   *
   * @param {string} guid The Global Unique ID of the company.
   * @param {object} body The fields to update.
   * @param {function} cb The callback with two parameters, errror and the updated company.
   * @returns
   */
  update(guid, body, cb) {
    this.client.patch(`companies/${guid}`, body, cb);
  }

  /**
   * Delete a single company resource.
   *
   * @param {string} guid The Global Unique ID of the company.
   * @param {function} cb A callback with one error parameter.
   * @returns
   */
  delete(guid, cb) {
    return this.client.delete(`companies/${guid}`, null, cb);
  }

}