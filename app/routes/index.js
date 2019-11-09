// require necessary packages
const express = require("express"),
    router = express.Router(),
    bcrypt = require("bcryptjs"),
    crypto = require('crypto'),
    User = require("../models/User"),
    fs = require('fs');

// route homepage
router.get("/", (req, res, next) => {
    res.render('index', { title: 'BitPay Developer Assessment' });
});

router.post("/register", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var newUser = new User({ username, password });
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
            if (err) {
                res.render('index', { register_fail_msg: "Registration failed! Please try again!", title: 'BitPay Developer Assessment' });
            } else {
                res.render('users', { register_success_msg: "Welcome " + username + "!", title: 'BitPay Developer Assessment', signed_msg: null, user: username })
            }
        });
    });
});

router.post("/storekey", (req, res) => {
    var publickey = req.body.publickey;
    var username = req.body.user;
    // console.log(username);
    User.findOne({ 'username': username }).then(usr => {
        var id = usr._id;
        // console.log(id);
        User.findOneAndUpdate({ _id: id }, { public_key: publickey }, { upsert: true }, (err, doc) => {
            if (err) throw err;
            res.render('users', { publickey_success_msg: "Public Key Stored.", title: 'BitPay Developer Assessment', signed_msg: null, user: username })
        });
    });
});

router.post("/genkey", (req, res) => {
    var username = req.body.user;
    crypto.generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem', cipher: 'aes-256-cbc', passphrase: 'top secret' }
    }, (err, publicKey, privateKey) => {
        if (err) return console.log('ERR:' + err);
        User.findOne({ 'username': username }).then(usr => {
            var id = usr._id;
            User.findOneAndUpdate({ _id: id }, { public_key: publicKey, private_key: privateKey }, { upsert: true }, (err, doc) => {
                if (err) throw err;
                res.render('users', { publickey_success_msg: "RSA Key Pair Stored.", title: 'BitPay Developer Assessment', signed_msg: null, user: username, })
            });
        });
    });
});

router.post("/signmsg", (req, res) => {
    var client_private = fs.readFileSync('certs/private.pem', 'utf-8', (err, data) => {
        if (err) return console.log(err.stack);
        console.log(data.toString());
        var signer = crypto.createSign('sha256');
        var message = req.body.message;
        signer.update(message);
        var signature = signer.sign(client_private, 'hex');
        res.render('users', { msg_sign_success: "RSA Key Pair Stored.", title: 'BitPay Developer Assessment', signed_msg: signature, user: null })
    });
});

module.exports = router;