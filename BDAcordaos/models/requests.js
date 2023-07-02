var mongoose = require('mongoose');

var requestsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    search: {
        type: String,
        required: true
    },
    results: [{ id: mongoose.Schema.Types.ObjectId }],
    concluded: {
        type: Boolean,
        required: true
    },
    dateRequested: {
        type: Date,
        required: true
    },
    dateConcluded: {
        type: Date,
        default: null
    },
    expireAt: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('requests', requestsSchema);