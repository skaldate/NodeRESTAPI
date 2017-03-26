// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8090; // set our port
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/trivia');
var Questions = require('./app/models/trivia');


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/questions')
    .post(function(req, res) {
        var question = new Questions(); // create a new instance of the Bear model
        question.category = req.body.category;
        question.category_id = req.body.category_id;
        question.type = req.body.type;
        question.difficulty = req.body.difficulty;
        question.correct_answer = req.body.correct_answer;
        question.incorrect_answers = req.body.incorrect_answers;
        // save the question and check for errors
        question.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'question created!' });
        });
    })
    .get(function(req, res) {
        var query = { type: "multiple" };
        amount = { limit: 5 };
        if (req.query.category) {
            query.category_id = Number(req.query.category);
        }
        if (req.query.difficulty) {
            query.difficulty = req.query.difficulty;
        }
        if (req.query.amount) {
            amount.limit = req.query.amount;
        }
        console.log(query);
        Questions.find(query, {}, amount, function(err, questions) {
            if (err)
                res.send(err);

            res.json(questions);
        });
    });
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);