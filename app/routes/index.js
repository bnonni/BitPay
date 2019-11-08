const express = require("express"), //require middleware
    router = express.Router(),
    bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken"),
    passport = require("passport"),
    keys = require('crypto');

/* Get home page */
router.get("/", (req, res, next) => {
    res.render('index', { title: 'BitPay Developer Assessment' });
});

var User = require("../models/User"); //require mongoose connection & model
var db = require("../config/db");

router.post("/users", (req, res) => {
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
                res.render('users', { register_success_msg: "Welcome " + username + "!", title: 'BitPay Developer Assessment', user: username });
            }
        });
    });
});

router.post("/publickey", (req, res) => {
    var publickey = req.body.publickey;
    var username = req.body.user;
    console.log(username);
    User.findOne({ 'username': username }).then(usr => {
        var id = usr._id;
        console.log(id);
        User.findOneAndUpdate({ _id: id }, { public_key: publickey }, { upsert: true }, (err, doc) => {
            if (err) throw err;
            res.render('users', { publickey_success_msg: "Public Key Stored.", title: 'BitPay Developer Assessment', user: username })
        });
    });
});

// 
module.exports = router;