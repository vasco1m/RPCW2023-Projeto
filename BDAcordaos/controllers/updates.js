var updates = require('../models/updates');
var mongoose = require('mongoose');

// Display list of all updates.
module.exports.list = async function() {
    try {
        return await updates.find().exec();
    } catch (erro) {
        return erro;
    }
}

//Display all updates of a specific user.
module.exports.listByUser = async function(userId) {
    try {
        return await updates.find({ userId: userId }).exec();
    } catch (erro) {
        return erro;
    }
}

//Display all updates of a specific acordao.
module.exports.listByAcordao = async function(acordaoId) {
    try {
        return await updates.find({ acordaoId: acordaoId }).exec();
    } catch (erro) {
        return erro;
    }
}

//Display all new updates.
module.exports.listNew = async function() {
    try {
        return await updates.find({ isNew: true }).exec();
    } catch (erro) {
        return erro;
    }
}

//Get update by id.
module.exports.getById = async function(updateId) {
    try {
        return await updates.findOne({ _id: updateId }).exec();
    } catch (erro) {
        return erro;
    }
}
 
// Add new update.
module.exports.add = async function(userId, acordaoId, fields, type) {
    try {
        var newUpdate = new updates({
            _id: new mongoose.Types.ObjectId(),
            userId: userId,
            acordaoId: acordaoId,
            isNew: true,
            fields: fields,
            type: type,
            date: new Date(),
            approved: 0,
            approvedBy: null,
            approvedDate: null
        });
        return await newUpdate.save();
    } catch (erro) {
        console.log(erro);
        return erro;
    }
}

// Set update as not new.
module.exports.setNotNew = async function(updateId, approved, approvedBy) {
    try {
        return await updates.updateOne({ _id: updateId }, { isNew: false, approved: approved, approvedBy: approvedBy, approvedDate: new Date() }).exec();
    }
    catch (erro) {
        return erro;
    }
}
