const mongoose = require('mongoose');

const Comment = require('../models/comments');

const getAllComments = async (req, res, next) => {
    const allCmnt = await Comment.find().exec();
    res.json(allCmnt);
}

const addComment = async (req, res, next) => {
    const newCmnt = new Comment({
        cmnt: req.body.cmnt,
        shown: true
    });
    const result = await newCmnt.save();
    res.json(result);
}

const removeComment = async (req, res, next) => {
    const id = req.body._id;
    const doc = await Comment.findOneAndUpdate(
        {_id: id},
        {shown: false},
        {new: true}
    )
    res.json(doc);
}

exports.getAllComments = getAllComments;
exports.addComment = addComment;
exports.removeComment = removeComment;