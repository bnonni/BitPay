var express = require("express"); //require middleware
var router = express.Router(); //import router
const User = require("../models/user"); //require mongoose connection & model

/* Get home page */
router.get("/", (req, res, next) => {
    res.render('index', { title: 'Login' });
});

router.get("/register", (req, res) => {
    res.render("game");
});

router.post("/register", (req, res) => {
    var username = req.body.log_username;
    var userpass = req.body.log_password

    var login = {
        uname: username,
        pass: userpass
    }
    console.log(login);

    User.findOne({ "username": username }, (err, user) => {
        if (user == null) {
            console.log(err);
            res.render("/", { login_fail_msg: "Login failed! Username and password not set. Please set your username and password." });
        } else if (userpass != user.password) {
            console.log(user);
            res.render("login", { login_fail_msg: "Password Invalid! Please try again." });
        } else if ((!err) && (userpass == user.password)) {
            res.redirect(302, "/users");
        }
    })
});

module.exports = router;