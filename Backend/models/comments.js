const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    cmnt: {type: String, required: true},
    shown: {type: Boolean, required: true}
});

module.exports = mongoose.model('comment', commentSchema);