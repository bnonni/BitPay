// require necessary packages
const express = require('express'),
    router = express.Router(),
    bcrypt = require('bcryptjs'),
    crypto = require('crypto'),
    User = require('../models/User'),
    fs = require('fs');

// route homepage
router.get('/', (req, res, next) => {
    res.render('index', { title: 'BitPay Developer Assessment' });
});

// route public verification page
router.get('/verify', (req, res, next) => {
    res.render('verify', { title: 'BitPay Developer Assessment', verification: null, username: '' });
});

// route registration
router.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // access db based on username, catch error if mongo not running
    User.findOne({ username: username })
        .then(user => {
            // check if username exists
            if (user) {
                return res.status(400).render('index', { title: 'BitPay Developer Assessment', register_fail_msg: "Username already exists." });
            } else {
                var newUser = new User({ username, password });
            }
            // hash password with salt, store to DB, load user page or index if error
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    User.findOne({ 'username': username })
                        .then(usr => {
                            res.render('users', { register_success_msg: 'Welcome ' + username + '!', title: 'BitPay Developer Assessment', signature: null, username: username, missing_key: 'hidden' });
                        })
                        .catch(err => {
                            res.render('index', { register_fail_msg: 'Registration failed! Please try again.', title: 'BitPay Developer Assessment' });
                        });
                });
            });
        })
        .catch(err => {
            res.status(400).render('index', { title: 'BitPay Developer Assessment', register_fail_msg: "Registeration failed! Make sure mongo is running." });
        })
});

// route public key store
router.post('/store', (req, res) => {
    const begin = /BEGIN | END/;
    var publickey = req.body.publickey,
        username = req.body.username;
    // check for improper key formatting, return err or reformat
    if (begin.test(publickey)) {
        return res.status(400).render('users', { publickey_store_fail: 'Error! Public Key Not Stored. Remove -----BEGIN PUBLIC KEY----- and -----END PUBLIC KEY-----', title: 'BitPay Developer Assessment', signature: null, username: username, missing_key: 'hidden' });
    } else {
        publickey = publickey.split(" ").join("\n");
        publickey = '-----BEGIN PUBLIC KEY-----\n' + publickey + '\n-----END PUBLIC KEY-----\n'
        console.log(publickey)
    }
    // find user in DB, update doc, catch err
    User.findOne({ username: username })
        .then(usr => {
            const id = usr._id;
            User.findOneAndUpdate({ _id: id }, { public_key: publickey, private_key: '' }, { upsert: true }, (err, doc) => {
                res.render('users', { publickey_store_success: 'Public Key Stored.', title: 'BitPay Developer Assessment', signature: null, username: username, missing_key: 'hidden' });
            });
        })
        .catch(err => {
            res.status(400).render('users', { publickey_store_fail: 'Error! Public Key Not Stored. Ensure proper formatting.', title: 'BitPay Developer Assessment', signature: null, username: username, missing_key: 'hidden' });
        });
});

router.post('/generate', (req, res) => {
    const username = req.body.username,
        { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });
    User.findOne({ username: username })
        .then(usr => {
            const _id = usr._id;
            User.findOneAndUpdate({ _id: _id }, { public_key: publicKey, private_key: privateKey }, { upsert: true }, (err, doc) => {
                (err ? (console.log(err)) : res.render('users', { publickey_store_success: 'RSA Key Pair Generated & Stored.', title: 'BitPay Developer Assessment', signature: null, username: username, missing_key: 'hidden' }));
            });
        })
        .catch(err => {
            res.status(400).render('users', { publickey_store_fail: 'Error! RSA Key Pair Stored Not Generated & Stored. Please try again.', title: 'BitPay Developer Assessment', signature: null, username: username, missing_key: 'hidden' });
        });
});

router.post('/sign', (req, res) => {
    var private_key, private_key_send, show = false;
    const username = req.body.username,
        message = req.body.message;
    User.findOne({ username: username })
        .then(usr => {
            private_key_send = req.body.privatekey;
            private_key = usr.private_key;
            const _id = usr._id;
            const sign = crypto.createSign('SHA256');
            if (private_key) {
                sign.update(message, 'utf-8');
                sign.end()
                const signature = sign.sign(private_key, 'hex');
                User.findOneAndUpdate({ _id: _id }, { message: message, signature: signature }, { upsert: true }, (err, doc) => {
                    show = true;
                    res.status(200).render('users', { msg_sign_success: 'Message Signed.', title: 'BitPay Developer Assessment', signature: signature, username: username, missing_key: 'hidden' });
                });
            } else if (private_key_send) {
                private_key_send = '-----BEGIN PRIVATE KEY-----\n' + req.body.privatekey + '\n-----END PRIVATE KEY-----\n';
                sign.update(message, 'utf-8');
                sign.end()
                const signature = sign.sign(private_key_send, 'hex');
                User.findOneAndUpdate({ _id: _id }, { private_key: private_key_send, message: message, signature: signature }, { upsert: true }, (err, doc) => {
                    show = true;
                    res.status(200).render('users', { msg_sign_success: 'Message Signed.', title: 'BitPay Developer Assessment', signature: signature, username: username, missing_key: 'show' });
                });
            } else {
                show = true;
                res.status(400).render('users', { msg_sign_fail: 'Error! Message Not Signed. Missing Private Key. Either generate new keys above or enter private key below.', title: 'BitPay Developer Assessment', signature: null, username: username, missing_key: 'show' });
            }
        })
        .catch(err => {
            var missing = 'hidden' ? show = false : missing = 'show';
            res.status(400).render('users', { msg_sign_fail: 'Error! Message Not Signed. Please check key formatting & try again.', missing_key: missing, title: 'BitPay Developer Assessment', signature: null, username: username });
        });
});

router.post('/verify', (req, res) => {
    const signature = req.body.signature,
        username = req.body.username,
        message = req.body.message;
    User.findOne({ 'username': username })
        .then(usr => {
            const public_key = usr.public_key,
                verify = crypto.createVerify('SHA256');
            console.log(public_key);
            verify.update(message, 'utf-8');
            verify.end();
            const verification = verify.verify(public_key, signature, 'hex');
            res.render('verify', { msg_verify_success: 'Signature Verified.', title: 'BitPay Developer Assessment', verification: verification, username: username })
        })
        .catch(err => {
            res.status(400).render('verify', { msg_verify_fail: 'Error! Message unverifiable. Please verify accuracy of your input data & retry.', title: 'BitPay Developer Assessment', verification: null, username: username })
        })
});

module.exports = router;