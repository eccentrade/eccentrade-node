export default class Users {

  constructor(client) {
    this.client = client;
  }

  /**
   * List users resources.
   *
   * @param {object} params Optional parameters, saved for future use.
   * @param {function} cb The callback with two parameters, errror and the user resource.
   * @returns
   */
  list(params, cb) {
    return this.client.get('users', params, cb);
  }

  /**
   * Get a user resource.
   *
   * @param {string} userId The id of the user.
   * @param {object} params Optional parameters, saved for future use.
   * @param {function} cb The callback with two parameters, errror and the user resource.
   * @returns
   */
  get(userId, params, cb) {
    return this.client.get(`users/${guid}`, params, cb);
  }

  /**
   * Create a new user resource.
   *
   * @param {object} body The company document to create.
   * @param {function} cb The callback with two parameters, errror and the newly created user.
   * @returns
   */
  create(body, cb) {
    return this.client.post('users', body, cb);
  }

  /**
   * Update a single user resource.
   *
   * @param {string} userId The id of the user.
   * @param {object} body The fields to update.
   * @param {function} cb The callback with two parameters, errror and the updated user resource.
   * @returns
   */
  update(userId, body, cb) {
    return this.client.post(`users/${userId}`, body, cb);
  }

    /**
   * Delete a single user resource.
   *
   * @param {string} userId The id of the user.
   * @param {function} cb The callback with two parameters, error and a result object with the deleted resource count.
   * @returns
   */
  delete(guid, cb) {
    return this.client.delete(`companies/${guid}`, cb);
  }

}
