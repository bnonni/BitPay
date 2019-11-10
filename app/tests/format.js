#!/usr/bin/env node

var punycode = require('punycode');
var key = "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArzuxS3499dXoNg3TqzOa qvPOati8iVutSiuYw6L+798AXo0RkrisIYPbKuqivbl8o1c/EndeJqUMuppOUC4q Cas71YtTNSFWC2v66CJ3KOzL+TNdyxiZ9Ge0a/udk5Vg9Rt9/Hx+OQEGFFwae2z8 0sP5QvqW6GZ9xJsmgAVIL7yG52UQDA7/8CQwwbfS/nEzAaNr+VMmSq/cat74lcXv DK7ccMaUFK+oKbKBOBxODwlJ/snjGbXa+dFcsN9PziVUMQfqANhlKGz2Dyd4mQEw 0G2NbV78pHkcbqCFMBEVUe0MQHwsl/gO1Dh+GE4tkHQLQZVmPOWIJUmnXdc8Ag4B oQIDAQAB-----END PUBLIC KEY-----";

key = key.replace('-----BEGIN PUBLIC KEY-----', '')
key = key.replace('-----END PUBLIC KEY-----', '')
key = key.split(" ").join("\n");
key = '-----BEGIN PUBLIC KEY-----\n' + key + '\n-----END PUBLIC KEY-----\n';
console.log(key)