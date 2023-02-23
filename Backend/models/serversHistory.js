const mongoose = require('mongoose');

const serverHistorySchema = new mongoose.Schema({
    ip: {type: String, required: true},
    name: {type: String, required: true},
    comp: {type: String, required: true},
    comment: {type: String, required: false},
    date: {type: String, required: true}
});

module.exports = mongoose.model('serverHistory', serverHistorySchema);