export default class Rules {

  constructor(client) {
    this.client = client;
  }

  /**
   * List all possible portfolio rules.
   *
   * @param {object} params
   * @param {function} cb
   *
   * @returns {array}
   */
  list(params, cb) {
    return this.client.get('portfolios/rules', params, cb);
  }

}