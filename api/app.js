const AqfrNetworkClient = require('aqfr.network.client');
const RippleAPI = require('ripple-lib').RippleAPI;
var express = require("express");
var bodyParser = require('body-parser');
const fetch = require('node-fetch');

var app = express();
var port = process.env.PORT || 8080;

const api = new RippleAPI({
  // server: 'wss://s1.ripple.com' // Public rippled server
  server: 'wss://s.altnet.rippletest.net:51233' // Test Net
});

api.connect().then(async () => {
  console.log('Connected to rippled');
});

const marketCoordinatorAccount = api.generateAddress();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//array to store all borrowers & lenders
var borrowers = new Map();
var lenders = new Map();
var matches = new Map();

app.listen(port, () => {
  console.log("Server running on port:", port);
});

app.get("/team", (req, res, next) => {
  res.json(["Warren", "Marcos", "Chris Opler", "Chris Tsang", "Elliot", "Chinmay"]);
});

app.post('/api/borrow', function (req, res) {
  var account = api.generateAddress();
  var obj = {}
  obj.id = create_UUID();
  obj.request_type = 'borrow';
  obj.amount = fiatToXRP(req.body.amount, req.body.currency);
  obj.currency = req.body.currency;
  obj.interest_rate = req.body.interest_rate;
  obj.address = account.address;
  obj.status = 'CREATED';

  console.log("borrower amount: ", obj.amount);
  borrowers.set(obj.id, obj);
  res.json(Object.assign({}, obj, { secret: account.secret }));
});

app.post('/api/lend', function (req, res) {
  var account = api.generateAddress();
  var obj = {}
  obj.id = create_UUID();
  obj.request_type = 'lend';
  obj.amount = req.body.amount;
  obj.currency = req.body.currency;
  obj.interest_rate = req.body.interest_rate;
  obj.address = account.address;
  obj.status = 'CREATED';

  lenders.set(obj.id, obj);
  res.json(Object.assign({}, obj, { secret: account.secret }));
});

app.get("/api/borrowers", (req, res, next) => {
  res.json(Array.from(borrowers));
});

app.get("/api/lenders", (req, res, next) => {
  res.json(Array.from(lenders));
});

app.get("/api/matches", (req, res, next) => {
  res.json(Array.from(matches));
});

app.get("/api/match/lender", async (req, res, next) => {
  // you are borrower, searching for a matching lender
  var borrower_id = req.body.id; // should be a borrower_id
borrower = borrowers.get(borrower_id);
var matching_amount = borrower.amount;
console.log("find lender with amount: ", matching_amount);
var match = {};
var result = {};
for (var value of lenders.values()) {
  if (matching_amount === value.amount) {
    match = value;
    result = await setUpMultisignAccount(borrower, value);
    break;
  }
}
res.json(Object.assign({}, match, result));
});


app.get("/api/match/borrower", async (req, res, next) => {
  // you are lender, searching for a matching borrower
  var lender_id = req.body.id; // should be a lender_id
lender = lenders.get(lender_id);
var matching_amount = lender.amount;
console.log("find borrower with amount: ", matching_amount);
var match = {};
var result = {};
for (var value of borrowers.values()) {
  if (matching_amount === value.amount) {
    match = value;
    result = await setUpMultisignAccount(value, lender);
    break;
  }
}
res.json(Object.assign({}, match, result));
});

app.get("/api/account", async (req, res, next) => {
  var address = req.body.account; // should be a multi-sign account_address from ledger
result = await api.getAccountInfo(address)
res.json(result);
});

async function setUpMultisignAccount(borrower, lender) {
  const response = await fetch('https://faucet.altnet.rippletest.net/accounts', { method: 'POST' });
  const account = (await response.json()).account;
  console.log(account);
  borrower.status = 'MATCHED';
  lender.status = 'MATCHED';
  borrower.collateral_account = account.address;
  lender.collateral_account = account.address;
  await sleep(8000);
  const prepared = await api.prepareSettings(account.address, {
    signers: {
      threshold: 2,
      weights: [
        {
          address: marketCoordinatorAccount.address,
          weight: 1
        },
        {
          address: borrower.address,
          weight: 1
        },
        {
          address: lender.address,
          weight: 1
        }
      ]
    }
  });
  //console.log('txJSON:', prepared.txJSON);
  const signed = api.sign(prepared.txJSON, account.secret);
  //console.log(signed);
  const result = await api.submit(signed.signedTransaction);
  console.log(result);
  matches.set(account.address, result)
  return result;
}

app.get("/withdrawal", async (req, res, next) => {
  const account = req.query.account;
const amount = req.query.amount; // XRP
const destination = req.query.destination; // address
const prepared = await api.preparePayment(account, {
      source: {
        address: account,
        amount: {
          value: amount,
          currency: 'XRP'
        }
      },
      destination: {
        address: destination,
        minAmount: {
          value: amount,
          currency: 'XRP'
        }

      }
    }, {
      maxLedgerVersionOffset: 3000,
      signersCount: 2
    }
);
res.json(prepared);
});

app.post('/withdrawal', async function (req, res) {
  const signedTransactions = req.body.signedTransactions;

  const combined = api.combine(signedTransactions);
  const result = await api.submit(combined.signedTransaction);
  console.log(result);

  res.json(result);
});

async function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(() => {
    resolve();
  }, timeout);
});
}

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

function fiatToXRP(amount, currency) {
  if (currency === 'XRP' || currency === 'xrp') {
    return amount;
  } else if (currency === 'USD' || currency === 'usd') {
    return parseInt(amount, 10) * 3.17;
  } else {
    return amount;
  }
}
/*
const dog = new AqfrNetworkClient('sendmoneyfast', 'password');
dog.on('message', function (msg) {
    console.log('RECEVIED:' + JSON.stringify(msg));
    if (msg.msg.text === '! status') {
        dog.sendMessage(msg.msg.sender.user_id, JSON.stringify(dog.aqfr2.sign({ msg: 'Wadda ya mean!!!' })));
    }
    else {
        dog.sendMessage(msg.msg.sender.user_id, 'Wadda ya mean!!!');
    }

});

dog.init().then(function (response) {
    console.log('init response:' + JSON.stringify(response));

}).catch(function (error) {
    console.log('sad face:' + error);
});*/