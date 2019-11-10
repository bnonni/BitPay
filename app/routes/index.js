// require necessary packages
const express = require('express'),
    router = express.Router(),
    bcrypt = require('bcryptjs'),
    crypto = require('crypto'),
    User = require('../models/User'),
    session = require('express-session'),
    fs = require('fs');
var _sesh;
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
    _sesh = req.session;
    _sesh.username = username;
    console.log(_sesh);
    const password = req.body.password;
    var newUser = new User({ username, password });
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
            User.findOne({ 'username': username }).then(usr => {
                (err ? (console.log(err), res.render('index', { register_fail_msg: 'Registration failed! Please try again!', title: 'BitPay Developer Assessment' })) : res.render('users', { register_success_msg: 'Welcome ' + username + '!', title: 'BitPay Developer Assessment', signed_msg: null, username: username }));
            })
        });
    });
});

router.post('/storekey', (req, res) => {
    const publickey = req.body.publickey;
    const username = req.body.username;
    _sesh = req.session;
    _sesh.username = username;
    _sesh.publicKey = publicKey;
    User.findOne({ 'username': username }).then(usr => {
        var id = usr._id;
        _sesh = req.session;
        _sesh._id = id;
        console.log(_sesh);
        User.findOneAndUpdate({ _id: id }, { public_key: publickey, private_key: '' }, { upsert: true }, (err, doc) => {
            (err ? (console.log(err)) : res.render('users', { publickey_success_msg: 'Public Key Stored.', title: 'BitPay Developer Assessment', signed_msg: null, username: username }));
        });
    });
});

router.post('/genkeys', (req, res) => {
    const username = req.body.username;
    _sesh = req.session;
    _sesh.username = username;
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    _sesh.publicKey = publicKey;
    console.log(_sesh);
    User.findOne({ 'username': username }).then(usr => {
        const _id = usr._id;
        _sesh._id = _id;
        User.findOneAndUpdate({ _id: _id }, { public_key: publicKey, private_key: privateKey }, { upsert: true }, (err, doc) => {
            (err ? (console.log(err)) : res.render('users', { publickey_success_msg: 'RSA Key Pair Stored.', title: 'BitPay Developer Assessment', signed_msg: null, username: username, }));
        });
    });

});

router.post('/signmsg', (req, res) => {
    const username = req.body.username,
        message = req.body.message;
    _sesh = req.session;
    _sesh.username = username;
    _sesh.message = message;
    User.findOne({ 'username': username })
        .then(usr => {
            const _id = usr._id
            const private_key = usr.private_key;
            const sign = crypto.createSign('SHA256');
            sign.write(message);
            sign.update(message);
            sign.end()
            const signature = sign.sign(private_key, 'hex');
            _sesh.signature = signature;
            User.findOneAndUpdate({ _id: _id }, { unsigned_message: message, signature: signature }, { upsert: true }, (err, doc) => {
                res.render('users', { msg_sign_success: 'Message Signed.', title: 'BitPay Developer Assessment', signed_msg: signature, username: username });
            });
        });
});

router.post('/verify', (req, res) => {
    _sesh = req.session;
    const signature = req.body.signature,
        username = req.body.username;
    User.findOne({ 'username': username })
        .then(usr => {
            const public_key = usr.public_key;
            console.log(public_key);
            const verify = crypto.createVerify('SHA256');
            verify.write(signature);
            verify.end();
            const verification = verify.verify(public_key, signature)
            console.log(verification);
            res.render('verify', { msg_verify_success: 'Signature Verified.', title: 'BitPay Developer Assessment', verification: verification, username: username })
        });
});

module.exports = router;