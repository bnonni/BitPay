const pwd = process.env.LocalMongoPassword;
module.exports = {
    MongoURI: "mongodb://hu5ky5n0w" + pwd + "localhost:27017/bitpay",
    secretOrKey: "secret"
};