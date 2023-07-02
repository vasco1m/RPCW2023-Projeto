var mongoose = require('mongoose');

var updatesSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    acordaoId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    isNew: {
        type: Boolean,
        required: true
    },
    fields: [{ field: String, old: String, new: String }],
    type: {
        type: Number,
        required: true
        // 0 - add, 1 - edit, 2 - delete, 3 - suggest
    },
    date: {
        type: Date,
        required: true
    },
    approved: {
        type: Number,
        default: false
        // 0 - not reviwed, 1 - approved, 2 - rejected
    },
    approvedBy: {
        type: String,
        default: null
    },
    approvedDate: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('updates', updatesSchema);