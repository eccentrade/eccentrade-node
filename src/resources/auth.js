export default class Users {

  constructor(client) {
    this.client = client;
  }

  /**
   * Sign in using either username or email, and a password.
   *
   * @param {string} user The username or email address.
   * @param {object} password Password.
   * @param {function} cb The callback with two parameters, error and a result object.
   * 
   * @returns {Promise}
   */
  login(user, password, cb) {
    const body = {
      appId: this.client.appId,
      password,
    };
    if ((user || '').indexOf('@') === -1) {
      body.username = user;
    } else {
      body.email = user;
    }
    return this.client.post('auth/login', body, cb);
  }

  /**
   * Refresh the access token.
   *
   * @param {string} refreshToken The refresh token.
   * @param {function} cb The callback with two parameters, error and a result object.
   * 
   * @returns {Promise}
   */
  refresh(refreshToken, cb) {
    return this.client.post('auth/refresh', {
      appId: this.client.appId,
      refreshToken,
    }, cb);
  }

}
