var express = require("express");
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//array to store all borrowers & lenders
var borrowers = new Map();
var lenders = new Map();

app.listen(port, () => {
    console.log("Server running on port:", port);
});

app.get("/team", (req, res, next) => {
    res.json(["Warren", "Marcos", "Chris Opler", "Chris Tsang", "Elliot", "Chinmay"]);
});

app.post('/api/borrow', function (req, res) {
    var obj = {}
    obj.id = create_UUID();
    obj.request_type = 'borrow';
    obj.amount = req.body.amount;
    obj.currency = req.body.currency;
    obj.interest_rate = req.body.interest_rate;

    borrowers.set(obj.id, obj);
    res.json(obj)
});

app.post('/api/lend', function (req, res) {
    var obj = {}
    obj.id = create_UUID();
    obj.request_type = 'lend';
    obj.amount = req.body.amount;
    obj.currency = req.body.currency;
    obj.interest_rate = req.body.interest_rate;

    lenders.set(obj.id, obj);
    res.json(obj)
});

app.get("/api/borrowers", (req, res, next) => {
    res.json(Array.from(borrowers));
});

app.get("/api/lenders", (req, res, next) => {
    res.json(Array.from(lenders));
});

app.get("/api/match/lender", (req, res, next) => {
    // you are borrower, searching for a matching lender
    var borrower_id = req.body.id; // should be a borrower_id
    borrower = borrowers.get(borrower_id);
    var matching_amount = borrower.amount;
    console.log("find lender with amount: ", matching_amount);
    var match = {};
    for (var value of lenders.values()) {
        //console.log(value);
        if (matching_amount === value.amount) {
            match = value;
        }
    }
    res.json(match);
});


app.get("/api/match/borrower", (req, res, next) => {
    // you are lender, searching for a matching borrower
    var lender_id = req.body.id; // should be a lender_id
    lender = borrowers.get(lender_id);
    var matching_amount = lender.amount;
    console.log("find borrower with amount: ", matching_amount);
    var match = {};
    for (var value of borrowers.values()) {
        //console.log(value);
        if (matching_amount === value.amount) {
            match = value;
        }
    }
    res.json(match);
});

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}