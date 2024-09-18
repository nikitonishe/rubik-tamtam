# rubik-tamtam
TamTam's Bot API kubik for the Rubik

## Install

### npm
```bash
npm i rubik-tamtam
```

### yarn
```bash
yarn add rubik-tamtam
```

## Use
```js
const { App, Kubiks } = require('rubik-main');
const TamTam = require('rubik-tamtam');
const path = require('path');

// create rubik app
const app = new App();
// config need for most modules
const config = new Kubiks.Config(path.join(__dirname, './config/'));

const tam = new TamTam();

app.add([ config, tam ]);

app.up().
then(() => console.info('App started')).
catch(err => console.error(err));
```

## Config
`tamtam.js` config in configs volume may contain the host and token.

If you do not specify a host, then `https://botapi.tamtam.chat/` will be used by default.

If you don't specify a token, you will need to pass it.
```js
...
const response = await app.get('tamtam').me({ token });
...
```

You may need the host option if for some reason TamTam host is not available from your server
and you want to configure a proxy server.


For example:
`config/tamtam.js`
```js
module.exports = {
  host: 'https://my.tamtam.proxy.example.com/'
};
```

## Extensions
TamTam kubik doesn't has any extension.
