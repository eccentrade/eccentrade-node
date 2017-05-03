export default class Applications {

  constructor(client) {
    this.client = client;
  }

  /**
   * List application resources.
   *
   * @param {object} params Optional parameters, saved for future use.
   * @param {function} cb The callback with two parameters, errror and the application resource.
   * @returns
   */
  list(params, cb) {
    return this.client.get('applications', params, cb);
  }

  /**
   * Get an application resource.
   *
   * @param {string} appId The id of the application.
   * @param {object} params Optional parameters, saved for future use.
   * @param {function} cb The callback with two parameters, errror and the application resource.
   * @returns
   */
  get(appId, params, cb) {
    return this.client.get(`applications/${appId}`, params, cb);
  }

  /**
   * Create a new application resource.
   *
   * @param {object} body The company document to create.
   * @param {function} cb The callback with two parameters, errror and the newly created application.
   * @returns
   */
  create(body, cb) {
    return this.client.post('applications', body, cb);
  }

  /**
   * Update a single application resource.
   *
   * @param {string} appId The id of the application.
   * @param {object} body The fields to update.
   * @param {function} cb The callback with two parameters, errror and the updated application resource.
   * @returns
   */
  update(appId, body, cb) {
    return this.client.post(`applications/${appId}`, body, cb);
  }

    /**
   * Delete a single application resource.
   *
   * @param {string} appId The id of the application.
   * @param {function} cb The callback with two parameters, error and a result object with the deleted resource count.
   * @returns
   */
  delete(appId, cb) {
    return this.client.delete(`applications/${appId}`, cb);
  }

}
