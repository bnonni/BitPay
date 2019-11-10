#!/usr/bin/env node

var crypto = require('crypto');
var bcrypt = require("bcryptjs");
const fs = require('fs');

var { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});
fs.writeFileSync('./pem/private.pem', privateKey, 'utf-8');
fs.writeFileSync('./pem/public.pem', publicKey, 'utf-8');