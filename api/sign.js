// Usage:
//     node sign {PREPARED_TRANSACTION} {SECRET} {SIGN_AS}

const tx = process.argv[2];
console.log('tx:', tx);
const prepared_transaction = JSON.parse(tx);
const secret = process.argv[3];
const sign_as = process.argv[4];

const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI();

const signed = api.sign(prepared_transaction.txJSON, secret, {
    signAs: sign_as
});

console.log(signed.signedTransaction);
