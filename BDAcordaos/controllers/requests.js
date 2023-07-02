var requests = require('../models/requests');
var mongoose = require('mongoose');


// Get a request by id
module.exports.getById = async function(requestId) {
    try {
        return await requests.findOne({ _id: requestId }).exec();
    } catch (erro) {
        return erro;
    }
}

// Get request by id with pagination
module.exports.getResults = async function(requestId, limit, page) {
    try {
        const request = await requests.findOne({ _id: requestId }).exec();
        const results = request.results;
        const total = results.length;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const resultsPage = results.slice(startIndex, endIndex);
        const res = {
            data: resultsPage,
            total: total
        }
        return res;
    } catch (erro) {
        return erro;
    }
}

// Get all requests from a user
module.exports.getByUser = async function(userId) {
    try {
        return await requests.find({ userId: userId }).exec();
    } catch (erro) {
        return erro;
    }
}

// Add new request
module.exports.add = async function(userId, search) {
    try {
        var newRequest = new requests({
            _id: new mongoose.Types.ObjectId(),
            userId: userId,
            search: search,
            results: [],
            concluded: false,
            dateRequested: new Date(),
            dateConcluded: null,
            expireAt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
        });
        const savedRequest = await newRequest.save();
        const insertedId = savedRequest._id;
        return insertedId;
    } catch (erro) {
        return erro;
    }
}

// Conclude request
module.exports.conclude = async function(requestId, results) {
    try {
        return await requests.findOneAndUpdate({ _id: requestId }, { $set: { results: results, concluded: true, dateConcluded: new Date() } }).exec();
    } catch (erro) {
        return erro;
    }
}

// Delete request
module.exports.delete = async function(requestId) {
    try {
        return await requests.deleteOne({ _id: requestId }).exec();
    } catch (erro) {
        return erro;
    }
}
