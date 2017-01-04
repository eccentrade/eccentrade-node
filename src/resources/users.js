export default class Users {

  constructor(client) {
    this.client = client;
  }

  /**
   * Get a user resource.
   *
   * @param {string} userId The id of the user.
   * @param {function} cb The callback with two parameters, error and a result object.
   * @returns
   *
   * @memberOf Accounts
   */
  get(userId, params, cb) {
    return this.client.get(`users/${guid}`, params, cb);
  }

}
