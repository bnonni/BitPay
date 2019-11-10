// require necessary packages
const express = require('express'),
    router = express.Router(),
    bcrypt = require('bcryptjs'),
    crypto = require('crypto'),
    User = require('../models/User'),
    session = require('express-session'),
    fs = require('fs');

// route homepage
router.get('/', (req, res, next) => {
    res.render('index', { title: 'BitPay Developer Assessment' });
});

// route public verification page
router.get('/verify', (req, res, next) => {
    res.render('verify', { title: 'BitPay Developer Assessment', verification: '' });
});

router.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    var newUser = new User({ username, password });
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
            User.findOne({ 'username': username }).then(usr => {
                (err ? (console.log(err), res.render('index', { register_fail_msg: 'Registration failed! Please try again!', title: 'BitPay Developer Assessment' })) : res.render('users', { register_success_msg: 'Welcome ' + username + '!', title: 'BitPay Developer Assessment', signature: null, username: username }));
            })
        });
    });
});

router.post('/store', (req, res) => {
    const publickey = req.body.publickey,
        username = req.body.username;
    User.findOne({ 'username': username }).then(usr => {
        const id = usr._id;
        console.log(_sesh);
        User.findOneAndUpdate({ _id: id }, { public_key: publickey, private_key: '' }, { upsert: true }, (err, doc) => {
            (err ? (console.log(err)) : res.render('users', { publickey_success_msg: 'Public Key Stored.', title: 'BitPay Developer Assessment', signature: null, username: username }));
        });
    });
});

router.post('/generate', (req, res) => {
    const username = req.body.username,
        { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });
    User.findOne({ 'username': username }).then(usr => {
        const _id = usr._id;
        User.findOneAndUpdate({ _id: _id }, { public_key: publicKey, private_key: privateKey }, { upsert: true }, (err, doc) => {
            (err ? (console.log(err)) : res.render('users', { publickey_success_msg: 'RSA Key Pair Stored.', title: 'BitPay Developer Assessment', signature: null, username: username, }));
        });
    });

});

router.post('/sign', (req, res) => {
    const username = req.body.username,
        message = req.body.message;
    User.findOne({ 'username': username })
        .then(usr => {
            const private_key = usr.private_key,
                sign = crypto.createSign('SHA256'),
                _id = usr._id;
            sign.update(message, 'utf-8');
            sign.end()
            const signature = sign.sign(private_key, 'hex');
            User.findOneAndUpdate({ _id: _id }, { message: message, signature: signature }, { upsert: true }, (err, doc) => {
                res.render('users', { msg_sign_success: 'Message Signed.', title: 'BitPay Developer Assessment', signature: signature, username: username });
            });
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
            verify.update(message, 'utf-8');
            verify.end();
            const verification = verify.verify(public_key, signature, 'hex');
            res.render('verify', { msg_verify_success: 'Signature Verified.', title: 'BitPay Developer Assessment', verification: verification, username: username })
        });
});

module.exports = router;