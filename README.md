<img src="/static/box-dev-logo.png" 
alt= "Box Dev Logo"
style="margin-left:-10px;"
width="40%">

# Box-node.js-SKD-with-OAuth-2.0
This project is a sample Node.js app featuring Box node.js SKD with OAuth 2.0.

Read a step-by-step guide in [this Medium blog post](https://medium.com/box-developer-blog/getting-started-with-box-node-js-sdk-with-oauth-2-0-5ca2e2e9c713).

# Run project

1. Use or create a [sandbox environment](https://support.box.com/hc/en-us/articles/360043697274-Managing-developer-sandboxes-for-Box-admins#:~:text=Using%20the%20Admin%20Console's%20Sandboxes,right%20corner%2C%20click%20Create%20Sandbox) or a [free account](https://account.box.com/signup/personal?tc=annual)
2. Navigate to [Dev Console](https://app.box.com/developers/console).
3. Create Box custom app.
4. Choose user autentication with OAuth 2.0.
5. Copy the Box client secret and client ID from Dev Console and paste them to to the .env file.
6. Generate a session secret key to the .env file.

```
npm install
```

```
npm start
```
