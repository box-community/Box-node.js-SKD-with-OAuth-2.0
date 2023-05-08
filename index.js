const http = require('http');
const fs = require('fs');
const url = require('url');

const BoxSDK = require('box-node-sdk');
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var sdk = new BoxSDK({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

var authURL = sdk.getAuthorizeURL({
  response_type: 'code'
});

const templateLogin = fs.readFileSync(
    `${__dirname}/templates/index.html`,
    'utf-8'
);

const templateAccount = fs.readFileSync(
    `${__dirname}/templates/account.html`,
    'utf-8'
);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);
    // TODO if session exists redirect to account
    if (pathname === '/' || pathname === '/login') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });

    const output = templateLogin.replace('{%LOGIN_HREF%}', authURL);
    res.end(output);
  } else if (pathname === '/account') {
    const code = query.code;
    if (code) {
        sdk.getTokensAuthorizationCodeGrant(code, null, function(err, tokenInfo) {
            let client = sdk.getPersistentClient(tokenInfo);

            res.writeHead(200, {
              'Content-type': 'text/html'
            });

            let name = ''
            let output = templateAccount
            const user = client.users.get(client.CURRENT_USER_ID);
            user.then((val => {
              name = val.name
              id = val.id;
              output = templateAccount.replace('{%USER_NAME%}', name).replace('{%USER_ID%}', id);
              res.end(output);
            })).catch((err) => {
              console.log(err)
              res.end('<h1>Could not fetch data</h1>');
            })
        });
    } else {
        res.writeHead(401, {
            'Content-type': 'text/html',
          });
        res.end('<h1>Not autenticated!</h1>');
    }
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`Listening to requests on port http://localhost:${PORT}`);
});
