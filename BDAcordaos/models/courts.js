var mongoose = require('mongoose');

var courtsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    acronym: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('courts', courtsSchema);