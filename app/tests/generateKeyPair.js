var crypto = require('crypto');
var bcrypt = require("bcryptjs");

crypto.generateKeyPair('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem', cipher: 'aes-256-cbc', passphrase: 'top secret' }
}, (err, publicKey, privateKey) => {
    if (err) console.log('ERR:' + err);
    console.log(publicKey);
    console.log(privateKey)
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        console.log(publicKey);
        bcrypt.hash(privateKey, salt, (err, hash) => {
            if (err) throw err;
            privateKey = hash;
            console.log('Hashed private key: ' + privateKey)
        });
    });
});