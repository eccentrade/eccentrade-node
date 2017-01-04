export default class Companies {

  constructor(client) {
    this.client = client;
  }

  /**
   * Find a company resource.
   * 
   * @param {string} guid The Global Unique ID of the company.
   * @param {function} cb The callback with two parameters, errror and company.
   * @returns
   * 
   * @memberOf Companies
   */
   get(guid, cb) {
     return this.client.get(`companies/${guid}`, {}, cb);
  }

  /**
   * 
   * Create a company resource.
   * 
   * @param {string} guid The Global Unique ID of the company.
   * @param {object} body The company to create.
   * @param {function} cb The callback with two parameters, errror and the newly created company.
   * @returns
   * 
   * @memberOf Companies
   */
  create(guid, body, cb) {
    return this.client.post(`companies/${guid}`, body, cb);
  }

  /**
   * Update a single company resource.
   *
   * @param {string} guid The Global Unique ID of the company.
   * @param {object} body The fields to update.
   * @param {function} cb The callback with two parameters, errror and the updated company.
   * @returns
   *
   * @memberOf Companies
   */
  update(guid, body, cb) {
    this.client.patch(`companies/${guid}`, body, cb);
  }

  /**
   * Delete a single company resource.
   *
   * @param {string} guid The Global Unique ID of the company.
   * @param {function} cb The callback with two parameters, error and a result object with the deleted resource count.
   * @returns
   *
   * @memberOf Companies
   */
  delete(guid, cb) {
    return this.client.delete(`companies/${guid}`, cb);
  }

}