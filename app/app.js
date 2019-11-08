const createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    session = require('express-session'),
    indexRouter = require('./routes/index'),
    MongoStore = require('connect-mongo')(session),
    db = require("./config/db");

process.setMaxListeners(Infinity)
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var secret = Math.ceil(Math.random() * 90000 + 10000).toString();
app.use(session({
    name: 'BitPay',
    cookie: { maxAge: 60000 },
    secret: secret,
    store: new MongoStore({ mongooseConnection: db }),
    resave: true,
    saveUninitialized: true,
    proxy: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;