# Sign and Verify Crypto
## Know Before You Go
* Core:
   - `Node v10.16.3`
   - `npm v6.9.0`
   - `MongoDB shell and db v4.2.1`

## What's what?
* `app/: app start location`
   - `|-bin/www: app start file`
   - `|-config/keys: contians mongoURI`
   - `|-config/db: contians mongoose setup for DB connection`
   - `|-models/User: contains mongoose user schema`
   - `|-public/javascripts/validation.js: static, client-side JS to validate set username, set password`
   - `|-public/stylesheets/style.css: static CSS sheet`
   - `|-routes/index: main router file containing all app routes`
   - `|-tests/: test scripts written in isolation for crypto functionality`
   - `|-views/: all ejs render templates for viewing engine`
   - `|-app.js: app creation file`

## Now You Know, Time To Go
1. Clone this repo
   SSH
   ```
   git clone git@github.com:bnonni/BitPay.git
   ```
   HTTPS
   ```
   git clone https://github.com/bnonni/BitPay.git
   ```

2. Open the repo in an editor, and `cd` into the app folder. 
   ```
   cd app
   ```

3. Inside app/ folder, install dependencies:
   ```
   npm install
   ```

4. Start your localhost mongoDB server

5. Start the app from the app/ folder 
   ```
   npm run app
   ```

6. Nagivate to [127.0.0.1:3000](http://127.0.0.1:3000)

## Features & Usability
* Home Page: [127.0.0.1:3000/](http://127.0.0.1:3000/)
   - Set Username, Set Password: user can set a user name and password
   - Verify Message: anyone can visit the /verify page from home page
* Users Page: [127.0.0.1:3000/users](http://127.0.0.1:3000/users)
   - Page inaccessible publicly; must set username & password first
   - Generate Key Pair: authenticated user can generate a new public/ private RSA key pair to use for signing and verifying
   - Store Public Key: Allows an authenticated user to store a public key on the server
   - Sign Message: Signs a message using a private key
* Verify Page: [127.0.0.1:3000/verify](http://127.0.0.1:3000/verify)
   - Publicly accessable page
   - Verify Signed Message: Allows anyone to submit a signed message to the server to verify if it has been signed by the private key associated with a specified user’s public key




