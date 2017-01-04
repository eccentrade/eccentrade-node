export default class Users {

  constructor(client) {
    this.client = client;
  }

  /**
   * Sign in.
   *
   * @param {string} email The email address of the user.
   * @param {object} password The password of the user.
   * @param {function} cb The callback with two parameters, error and a result object.
   * @returns
   */
  login(email, password, cb) {
    return this.client.post('auth/login', {
      appId: this.client.appId,
      email,
      password,
    }, cb);
  }

  /**
   * Refresh the access token.
   * 
   * @returns
   */
  refresh(cb) {
    return this.client.post('auth/refresh', {}, cb);
  }

}
