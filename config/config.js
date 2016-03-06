var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = function(app) {

    //bodyparser for parsing post request bodies
    app.use(bodyParser.json()); // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
        extended: true
    }));

    //setting the cookie parser and session
    app.use(session({
        secret: 'PsafkSKD34ahufAjqqwd23ranwkefjw5rfar11rWEF',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    }));

    //DB connection
    app.set('db', 'mongodb://localhost:27017/techcraze');

    //Connecting the DB
    mongoose.connect(app.get('db'));

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(callback) {
        console.log('DB Connected');
    });
};
