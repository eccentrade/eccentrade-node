import Rules from './portfolios/rules';

export default class Portfolios {

  constructor(client) {
    this.client = client;
    this.rules = new Rules(this.client);
  }

}
