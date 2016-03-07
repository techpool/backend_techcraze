var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
	emailId:{
		type: String,
		required: true
	},
    name: {
        type: String,
        required: true
    },
    partners: {
        type: [String]
    },
    paid: {
    	type: Boolean,
    	required: true
    }
});

module.exports = mongoose.model('events', eventSchema);
