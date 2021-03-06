# node-parsec-sdk

UNOFFICIAL and WIP JavaScript/TypeScript SDK for Parsec remote desktop.

## DISCLAIMER

This is an **UNOFFICIAL** package, which is also very early in development. The vast majority of necessary features is missing at this point. See the _Roadmap_ project and issues on Github to get a list of upcoming functionalities.

**I AM NOT** associated with Parsec or Unity in any way.

## Installation

```
npm install --save parsec-sdk
```

## Documentation

Online documentation is automatically generated using [TypeDoc](https://typedoc.org/) and hosted on Github Pages. It's available on [https://maciejpedzich.github.io/node-parsec-sdk/](https://maciejpedzich.github.io/node-parsec-sdk/)

## Code example

```js
// CommonJS (ES5)
const { Client } = require('parsec-sdk');

// Module import (ES6+ and TypeScript)
import { Client } from 'parsec-sdk';

const parsec = new Client();

async function authDemo() {
  try {
    await parsec.authPersonal({
      email: 'parsec-account-email@example.com',
      password: 'ParsecAccountP4ssword!',
      tfa: '123456' // OPTIONAL TFA code
    });

    console.log(`Peer ID: ${parsec.peerID}\nSession ID: ${parsec.sessionID}`);
  } catch (error) {
    console.error(error);
  }
}

async function hostsDemo() {
  try {
    const { data } = await parsec.getHosts({ mode: 'desktop' });

    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

authDemo();
hostsDemo();
```

## Development

After cloning the repository, simply `cd` into the repository's directory in your CLI and run `npm install`

### Manually formatting code

```
npm run prettier-format
```

### Linting code

```
npm run lint
```

### Running unit tests with Jest

```
npm run test
```

### Creating a build

```
npm run build
```

### Generating documentation website

```
npm run generate-docs
```

### License

MIT
