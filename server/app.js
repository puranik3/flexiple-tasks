let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

let jwt = require('./services/jwt');

let User = require( './models/User' );
let Task = require('./models/Task');

let app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.all('*', authenticate);

function authenticate(req, res, next) {
    function sendError() {
        res.status(401).send({
            message: 'You are not authorized to view this'
        });
    }

    if (req.path === '/login') return next();

    if (!req.headers.authorization) {
        return res.status(401).send({
            message: 'You are not authorized to view this'
        });
    }

    let token = req.headers.authorization.split(' ')[1];
    
    let payload;
    try {
        payload = jwt.decode(token, 'shhh...');
    } catch (err) {
        return sendError();
    }

    if (!payload || !payload.sub) {
        return sendError();
    }

    res.locals.payload = payload;

    next();
}

app.post('/login', function (req, res) {
    let body = req.body;

    User.findOne(
        {
            email: body.email,
            password: body.password
        },
        function (err, result) {
            if (err) { return err; }

            if (!result) {
                return res.status(401).send({
                    message: 'Incorrect email or password - Authentication failed.'
                });
            }

            let payload = {
                iss: req.hostname,
                sub: '' + result._id
            };

            let token = jwt.encode(payload, 'shhh...');

            res.json({
                email: body.email,
                authToken: token
            });
        }
    );
});

app.get('/tasks', function (req, res) {
    Task.find(
        {
            $or: [
                {
                    userId: res.locals.payload.sub
                },
                {
                    type: 'Public'
                }
            ]
        },
        function (err, results) {
            if (err) { return err; }

            res.json(results);
        }
    );
});

app.post('/tasks', function (req, res) {
    let body = req.body;

    let task = new Task({
        title: body.title,
        deadline: new Date( body.deadline ),
        description: body.description,
        type: body.type || 'Private',
        created: new Date,
        userId: res.locals.payload.sub
    });

    console.log(task);

    task.save(function (err) {
        if (err) { return err; }
        res.status(200).json(task);
    });
});

mongoose.connect('mongodb://localhost/flexiple-tasks');

let server = app.listen(3000, function (err) {
    if (err) { return console.log('Error starting web server'); }

    console.log('Web server listening on port', server.address().port);
});