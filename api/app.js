var express = require("express");
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.listen(port, () => {
    console.log("Server running on port:", port);
});

app.get("/team", (req, res, next) => {
    res.json(["Warren", "Marcos", "Chris Opler", "Chris Tsang", "Elliot", "Chinmay"]);
});

app.post('/api/borrow', function (req, res) {
    var obj = {}
    obj.id = req.body.id;
    obj.request_type = 'borrow';
    obj.amount = req.body.amount;
    obj.currency = req.body.currency;
    obj.interest_rate = req.body.interest_rate;

    res.json(obj)
});

app.post('/api/lend', function (req, res) {
    var obj = {}
    obj.id = req.body.id;
    obj.request_type = 'lend';
    obj.amount = req.body.amount;
    obj.currency = req.body.currency;
    obj.interest_rate = req.body.interest_rate;

    res.json(obj)
});