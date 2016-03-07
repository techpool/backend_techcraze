var mongoose = require('mongoose');

var pendingRequestsSchema = new mongoose.Schema({
    emailId: {
        type: String,
        required: true
    },
    partnerEventId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('pending', pendingRequestsSchema);
