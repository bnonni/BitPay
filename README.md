# BitPay Developer Assessment
## Know Before You Go
* Versioning: 
   - Node v10.16.3
   - npm v6.9.0
   - MongoDB shell and db v4.2.1

## Who's On First?
* app/bin/www: app init root
* app/config:
   - keys.js: mongoURI, passport secret
   - passport.js: password salt config
* app/models:

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

4. Start the app from app/
   ```
   npm run app
   ```

5. Nagivate to [127.0.0.1:3000](http://127.0.0.1:3000)

## Features & Usability
* 