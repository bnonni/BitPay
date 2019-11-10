#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');

var { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});
fs.writeFileSync('./pem/private.pem', privateKey, 'utf-8');
fs.writeFileSync('./pem/public.pem', publicKey, 'utf-8');

privateKey = fs.readFileSync('./pem/private.pem', 'utf-8');
publicKey = fs.readFileSync('./pem/public.pem', 'utf-8');
const message = fs.readFileSync('message.txt', 'utf-8');

const sign = crypto.createSign('SHA256');
// sign.write(message);
sign.update(message, 'utf-8');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = crypto.createVerify('SHA256');
verify.update(message, 'utf-8');
verify.end();

const verification = verify.verify(publicKey, signature, 'hex')

console.log(JSON.stringify({
    message: message,
    signature: signature,
    verified: verification,
}, null, 2));

// console.log(signature)
// console.log(typeof(signature))
// console.log('signature_hex')
// console.log(signature_hex)
// console.log(typeof(signature_hex))

// const signature_hex_obj = Buffer.from(signature_hex, 'utf-8')
// console.log('signature_hex')
// console.log(signature_hex_obj)
// console.log(typeof(signature_hex_obj))