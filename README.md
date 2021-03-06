# eccentrade-node
> Official JavaScript client for the Eccentrade API https://developer.eccentrade.com. Works on both server and client side.

## Installation

```bash
npm install eccentrade-client
```

## Usage

Require Eccentrade:

```node
const Eccentrade = require('eccentrade-client');
```

Create a client:
#### Using Personal Access Tokens
```node
const client = new Eccentrade.Client({ token: 'my_token' });
```

#### Using credentials (deprecated)
```node
const client = new Eccentrade.Client({
  appId: <appId>
  email: <email>
  password: <password>
});
```
