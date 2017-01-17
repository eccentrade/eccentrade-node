import Portfolios from './user/portfolios';

/**
 * These resources are bound to the authenticated user.
 */
export default class User {

  constructor(client) {
    this.client = client;
    this.portfolios = new Portfolios(this.client)
  }

}
