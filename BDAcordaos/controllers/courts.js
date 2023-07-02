var courts = require('../models/courts');
var mongoose = require('mongoose');

// Display list of all courts.
module.exports.list = async function() {
    try {
        return await courts.find({}, { _id: 0, acronym: 1, name: 1 }).exec();
    } catch (erro) {
        return erro;
    }
}

// Add new court.
module.exports.add = async function(acronym, name) {
    try {
        var newCourt = new courts({
            _id: new mongoose.Types.ObjectId(),
            acronym: acronym,
            name: name
        });
        return await newCourt.save();
    } catch (erro) {
        return erro;
    }
}
