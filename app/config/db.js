// get mongo keys and connect to DB
const mongoose = require('mongoose'),
    keys = require('./keys');

mongoose.connect(keys.MongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
var db = mongoose.connection;

db.on('error', (err) => {
    console.log('connection error', err);
});

db.once('open', () => {
    console.log('Connection to DB successful');
});

module.exports = db;