const mongoose = require('mongoose');

const nameSchema = new mongoose.Schema({
    label: {type: String, required: true},
    value: {type: String, required: true}
});

module.exports = mongoose.model('name', nameSchema);