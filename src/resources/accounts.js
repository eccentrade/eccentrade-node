export default class Accounts {

  constructor(client) {
    this.client = client;
  }

  /**
   * Sign in.
   *
   * @param {string} appId The appId if the requesting app.
   * @param {object} options
   * @param {function} cb The callback with two parameters, error and a result object.
   * @returns
   * 
   * @memberOf Accounts
   */
  login(email, password, cb) {
    return this.client.post('auth/login', {
      appId: this.client.appId,
      email,
      password,
    }, cb);
  }

  /**
   * Request a password reset link.
   *
   * @param {string} appId The appId if the requesting app.
   * @param {string} email The email address of the user. If omitted, the primary email address is used.
   * @param {function} cb The callback with two parameters, error and a result object.
   * @returns
   *
   * @memberOf Accounts
   */
  forgotPassword(email, cb) {
    return this.client.post('accounts/forgot-password', {
      appId: this.client.appId,
      email,
    }, cb);
  }

  /**
   * Reset the password using the token.
   *
   * @param {string} token The token that was sent by mail.
   * @param {string} newPassword The new SHA-256 encrypted password to store.
   * @param {function} cb The callback with two parameters, error and the result object.
   * @returns
   *
   * @memberOf Accounts
   */
  resetPassword(token, newPassword, cb) {
    return this.client.post('accounts/reset-password', {
      token,
      newPassword,
    }, cb);
  }

}

