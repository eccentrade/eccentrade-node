import Triggers from './portfolios/triggers';

export default class Portfolios {

  constructor(client) {
    this.client = client;
    this.triggers = new Triggers(this.client);
  }

}
