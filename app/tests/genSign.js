#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');

// crypto.generateKeyPair('rsa', {
//     modulusLength: 4096,
//     publicKeyEncoding: { type: 'spki', format: 'pem' },
//     privateKeyEncoding: { type: 'pkcs8', format: 'pem', cipher: 'aes-256-cbc', passphrase: 'top secret' }
// }, (err, publicKey, privateKey) => {
//     if (err) console.log('ERR:' + err);
//     console.log(publicKey);
//     console.log(privateKey)
//     bcrypt.genSalt(10, (err, salt) => {
//         if (err) throw err;
//         console.log(publicKey);
//         bcrypt.hash(privateKey, salt, (err, hash) => {
//             if (err) throw err;
//             privateKey = hash;
//             console.log('Hashed private key: ' + privateKey)
//         });
//     });
// });
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
})

// const private_key = fs.readFileSync('../.certs/hu5ky5n0w/private.pem', 'utf-8')
// const public_key = fs.readFileSync('../.certs/hu5ky5n0w/public.pem', 'utf-8')
const message = fs.readFileSync('message.txt', 'utf-8')


const sign = crypto.createSign('SHA256');
sign.write(message);
sign.update(message);
sign.end()
const signature = sign.sign(privateKey);
console.log(typeof(sign))
console.log(signature)