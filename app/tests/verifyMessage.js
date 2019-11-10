#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');

// var { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//     modulusLength: 2048,
//     publicKeyEncoding: { type: 'spki', format: 'pem' },
//     privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
// });
// fs.writeFileSync('./pem/private.pem', privateKey, 'utf-8');
// fs.writeFileSync('./pem/public.pem', publicKey, 'utf-8');

const privateKey = "-----BEGIN PRIVATE KEY-----\n\
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDqx5pC5Jr/DXsg\
n0MiwzyPCSrkcpiY3/heEUYfT0+L9mijluzSq+fDOjkH+5wFyj1AWeYRXxJLVzTs\
8iDidlm/82TjuQ12vEm0GN2VFvqhlK9uKlKwnYgb4aZeFJlyzmIvZ6fnVk4TbjJk\
U/ooB0vwO6u9fCk8LJJ7DQPIUozZofhO5WcUc3pCKYm4VY0scc5mh0uOWLWY/0cy\
FRhWeHJDJgQiBfXwHW/zL10uKNZ0DYYbXYthq9NZ3PwBrPozCbjOKKLUvurRLhBH\
RephWbRVPH+R7r3liuJKFEDBgvDXR2vGyoEW+Qzlsi2UnYKxicTBL7Lv7yD5mKPE\
BegZHW9bAgMBAAECggEAKKkE6EzbIwzcpBuw7tZNKKB30zSdhOxVAUWQlV+Q8TZt\
jNdYkGvBKahttBo5PS93SCvJknyamH2z5s1QMKg6hunKMT4dPNEDGrOrvGRMZ6tu\
bm/Z/khqCBoeS/DZWm6vxnH3PDNQNkFBbOq2SjRpTGOpLJnSMl+txq3MV+ckCZSU\
lkGbnkOtoSDVrtR+ym18gi83aVTlbssgnD1ElMPzslNhTjSlJ0ARfe9eFqUGinDW\
B+HypLCB0GQeOHT+Vm0iINJD7GqIRDkbpTgmwkRFS+Hzd7jtqiK+g2owrQEN5pHx\
GEBpnEvPKhDdwe4uKm5r6hscc1gQCVoq4KFBRAOOEQKBgQD33gq03mRwqNvqaAbG\
4DOz+dVq9lrShzkjDpc6AxsCIrc8VIhC9/fEj9vHBewhL9oNkanLTHCgDkQ81ZII\
2sRd4ECPdBRn5TMFSjQifeJv7CuYjpc/fHYplk0+VYYrRAxYpXhQ37b7T0eCVihL\
QbKIS0HoiXxQH+Ksn/dLYNlh1QKBgQDye6GW7COcMEa/Temw/Cp1jfJ78M6BDVcv\
BkNXlLexZRDqJA732tfWd9UNVn64+jwH+M8TQGu6PptCVu63htYlbgKsgtlpGg1c\
UJKpNEevlrB4ueS/WFX7MOWjH05mlOdEhXoGEScx+r2s8LB9NV1iytkeHUSuoAKl\
voLdBKn0bwKBgH/t8TayxcJD1OVh9YV1uBm+64C+T9fzBPFsGW9OpQTwKASSWJW/\
5/hii3toOhxS10dDlBAijsp9Moj3bdz2FH2jPY8MyW9qI3AqgUgAEvvTOBkQF04k\
DdSfB5URjSMNhxXFqZiMLqP8ohrKHxfge6XOueCr/SZZnqOcGIWmIexVAoGBAL6v\
/slC9lYTmO9EhCxMgc9kS3awTpUqOo+ea0LqjvKQOhcHOEYt8WKVZhRRGuK41pCm\
V6IaHR2fslUfLCdjf/B7bNrhI7wFYtBgBJXPqTgqVqj59yuKekNJlq0LJ4qAOsal\
+Ongf2RMfPENbp1oZAIW51tJRQPWjX5uLVdGHak9AoGBAKNPqTmhMTsKkntgckrB\
jtaw4FiRwWeu1H1s26AstysMbsXU7NCk6zTt4pAg215ww+8fCrHjU1P3aGb1QD+B\
Rw3lCHXRbijSK0X3H2itD0wPdwaXhfj6AnAHKEq5EGP8jVo5oQ+Vh98Lbk/DO/y+\
q9rzMzq4dzgmWB6GRiJUonFJ\n\
-----END PRIVATE KEY-----\n";
const publicKey = "-----BEGIN PUBLIC KEY-----\n\
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6seaQuSa/w17IJ9DIsM8\
jwkq5HKYmN/4XhFGH09Pi/Zoo5bs0qvnwzo5B/ucBco9QFnmEV8SS1c07PIg4nZZ\
v/Nk47kNdrxJtBjdlRb6oZSvbipSsJ2IG+GmXhSZcs5iL2en51ZOE24yZFP6KAdL\
8DurvXwpPCySew0DyFKM2aH4TuVnFHN6QimJuFWNLHHOZodLjli1mP9HMhUYVnhy\
QyYEIgX18B1v8y9dLijWdA2GG12LYavTWdz8Aaz6Mwm4ziii1L7q0S4QR0XqYVm0\
VTx/ke695YriShRAwYLw10drxsqBFvkM5bItlJ2CsYnEwS+y7+8g+ZijxAXoGR1v\
WwIDAQAB\n\
-----END PUBLIC KEY-----\n";
console.log(privateKey)
console.log(publicKey)
    // process.exit(0)

// fs.readFileSync('./pem/public.pem', 'utf-8');
const message = fs.readFileSync('message.txt', 'utf-8');

const sign = crypto.createSign('SHA256');
// sign.write(message);
sign.update(message, 'utf-8');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = crypto.createVerify('SHA256');
verify.update(message, 'utf-8');
verify.end();

const verification = verify.verify(publicKey, signature, 'hex')

console.log(JSON.stringify({
    message: message,
    signature: signature,
    verified: verification,
}, null, 2));

// console.log(signature)
// console.log(typeof(signature))
// console.log('signature_hex')
// console.log(signature_hex)
// console.log(typeof(signature_hex))

// const signature_hex_obj = Buffer.from(signature_hex, 'utf-8')
// console.log('signature_hex')
// console.log(signature_hex_obj)
// console.log(typeof(signature_hex_obj))