require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const BoxSDK = require('box-node-sdk');

const PORT = process.env.PORT || 8000;

const sdk = new BoxSDK({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

const authURL = sdk.getAuthorizeURL({
  response_type: 'code',
  redirect_uri: `http://localhost:${PORT}/authorize_callback`
});

const app = express();

app.use(
  // Session default in memory store not production ready. Will leak memory over time
  // Use redis or some other MemoryStore impl.
  session({
    secret: '68747470733a2f2f747769747465722e636f6d2f6d617443686f6a65636b79',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true } // secure will set cookies only on https but we in localhost here
  })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'templates'));

// All restricted pages should use this middleware
// Well tbh honest most secure would be to use app.use(auth_middleware) for all app and exclude public pages
// But this way is easier :D
const auth_middleware = (req, res, next) => {
  if (req.session.user) return next();

  res.redirect('/login');
};

app.get('/', auth_middleware, (req, res) => {
  const user = req.session.user;

  res.render('index', {
    name: user.name,
    id: user.id
  })
});

app.get('/login', (req, res) => {
  res.render('login', { login_url: authURL });
});


app.get('/authorize_callback/:code', async (req, res) => {
  const { code } = req.query;

  if (!code) return res.status(401).send("Access denied");

  const tokenInfo = await sdk.getTokensAuthorizationCodeGrant(code);
  const client = sdk.getPersistentClient(tokenInfo);
  const user = await client.users.get(client.CURRENT_USER_ID);

  // Save user in session for persistence, this is basic of auth middleware implementation
  req.session.user = user;
  req.session.user_token = tokenInfo; // Split storing access token and refresh token for production

  req.redirect('/account');
});

app.post('/logout', (req, req) => {
  req.session.destroy(); // Removes session data from req object
  res.redirect('/login');
})

// WIldcard for not defined URLs
app.use('*', (req, res) => {
  res.setHeader('Content-type', 'text/html')
  res.status(404).header().end('<h1>Page not found!</h1>');
})

app.listen(PORT, () => {
  console.log(`Listening to requests on port http://localhost:${PORT}`);
});

