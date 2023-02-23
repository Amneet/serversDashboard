const mongoose = require('mongoose');

const ServerHistory = require('../models/serversHistory');

const addServerHistory = (req, res, next) => {
    const newSrvHis = new ServerHistory({
        ip: req.body.ip,
        name: req.body.name,
        comp: req.body.comp,
        comment: req.body.comment,
        date: new Date().toDateString()
    }).save();
}

exports.addServerHistory = addServerHistory;