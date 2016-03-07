var express = require('express');
var app = express();

var port = process.env.PORT || 8000;

/* Configuration */
require('./config/config.js')(app);

/* Mdels */
Student = require('./models/students.js');
Events = require('./models/events.js');
Pending = require('./models/pending.js');

/* Routes */
require('./routes/register.js')(app);
require('./routes/login.js')(app);
require('./routes/events.js')(app);

app.listen(port, function() {
    console.log('Server started at port ' + port );
});
