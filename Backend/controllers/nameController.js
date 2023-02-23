const mongoose = require('mongoose');

const Names = require('../models/names');

const getAllNames = async (req, res, next) => {
    const allNames = await Names.find().exec();
    res.json(allNames);
}

const addNewName = async (req, res, next) => {
    const newName = new Names({
        label: req.body.name,
        value: req.body.name,
    });
    const result = await newName.save();
    res.json(result);
}

exports.getAllNames = getAllNames;
exports.addNewName = addNewName;