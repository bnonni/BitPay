// require necessary packages
const express = require('express'),
    router = express.Router(),
    bcrypt = require('bcryptjs'),
    crypto = require('crypto'),
    User = require('../models/User'),
    session = require('express-session'),
    fs = require('fs');

const private_key = fs.readFileSync('certs/private.pem', 'utf-8')
const public_key = fs.readFileSync('certs/public.pem', 'utf-8')
var __sesh;
// route homepage
router.get('/', (req, res, next) => {
    res.render('index', { title: 'BitPay Developer Assessment' });
});

// route public verification page
router.get('/verify', (req, res, next) => {
    res.render('verify', { title: 'BitPay Developer Assessment' });
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
            if (err) {
                res.render('index', { register_fail_msg: 'Registration failed! Please try again!', title: 'BitPay Developer Assessment' });
            } else {
                res.render('users', { register_success_msg: 'Welcome ' + username + '!', title: 'BitPay Developer Assessment', signed_msg: null, username: username })
            }
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
        // TODO: Create private key associated with new public key
        User.findOneAndUpdate({ _id: id }, { public_key: publickey }, { upsert: true }, (err, doc) => {
            if (err) throw err;
            res.render('users', { publickey_success_msg: 'Public Key Stored.', title: 'BitPay Developer Assessment', signed_msg: null, username: username })
        });
    });
});

router.post('/genkeys', (req, res) => {
    const username = req.body.username;
    _sesh = req.session;
    _sesh.username = username;
    crypto.generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem', cipher: 'aes-256-cbc', passphrase: 'top secret' }
    }, (err, publicKey, privateKey) => {
        _sesh.publicKey = publicKey;
        console.log(_sesh);
        if (err) return console.log('ERR:' + err);
        User.findOne({ 'username': username }).then(usr => {
            var id = usr._id;
            User.findOneAndUpdate({ _id: id }, { public_key: publicKey, private_key: privateKey }, { upsert: true }, (err, doc) => {
                if (err) throw err;
                res.render('users', { publickey_success_msg: 'RSA Key Pair Stored.', title: 'BitPay Developer Assessment', signed_msg: null, username: username, })
            });
        });
    });
});

router.post('/signmsg', (req, res) => {
    User.findOne({ 'username': username }).then(usr => {
        _sesh = req.session;
        const id = usr._id,
            private_key = usr.private_key,
            username = req.body.username,
            message = req.body.message,
            sign = crypto.createSign('SHA256');
        _sesh.username = username;
        _sesh.message = message;
        sign.write(message);
        sign.update(message);
        sign.end()
        const signature = sign.sign(private_key, 'hex');
        _sesh.signature = signature;
        res.render('users', { msg_sign_success: 'Message Signed.', title: 'BitPay Developer Assessment', signed_msg: signature, username: username });
    });
});

// router.post('/verify', (req, res) => {
//     const message = req.body.message;
//     const sign = crypto.createSign('SHA256');
//     sign.write(message);
//     sign.update(message);
//     sign.end()
//     const signature = sign.sign(private_key, 'hex');
//     res.render('users', { msg_sign_success: 'RSA Key Pair Stored.', title: 'BitPay Developer Assessment', signed_msg: signature, user: null })
// });

module.exports = router;