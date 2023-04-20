const http = require('http');
const fs = require('fs');
const url = require('url');

const BoxSDK = require('box-node-sdk');

var sdk = new BoxSDK({
	clientID: 'clientID',
	clientSecret: 'clientSecret'
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
        console.log(code)
        sdk.getTokensAuthorizationCodeGrant(code, null, function(err, tokenInfo) {
            let client = sdk.getPersistentClient(tokenInfo);

            res.writeHead(200, {
                'Content-type': 'text/html'
            });

            const user = client.users.get(client.CURRENT_USER_ID);
            console.log(user)
    
            const output = templateAccount
            res.end(output);
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

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port http://localhost:8000');
});

