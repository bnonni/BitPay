#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');

const private_key = fs.readFileSync('../.certs/hu5ky5n0w/private.pem', 'utf-8')
const public_key = fs.readFileSync('../.certs/hu5ky5n0w/public.pem', 'utf-8')
const message = fs.readFileSync('message.txt', 'utf-8')


const sign = crypto.createSign('SHA256');
sign.write(message);
sign.update(message);
sign.end()
const signature = sign.sign(private_key);
console.log(typeof(sign))
console.log(signature)