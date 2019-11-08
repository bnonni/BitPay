var crypto = require('crypto');

var publickey = crypto.generateKeyPair('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem', cipher: 'aes-256-cbc', passphrase: 'top secret' }
}, (err, publicKey, privateKey) => {
    if (err) console.log('ERR:' + err)
    console.log('Public: ' + publicKey);
    console.log('Private: ' + privateKey);
});