const mongoose = require("mongoose");

const Server = require("../models/servers");
const ServerHistory = require("../models/serversHistory");
const serverHistoryController = require("./serverHistoryController");
const { all } = require("../routes/serverRoute");

const getAllServers = async (req, res, next) => {
    const allFree = await Server.find().exec();
    res.json(allFree);
};

const getAllUsedServers = async (req, res, next) => {
    const allUsed = await Server.find().exec();
    // const data = allUsed.filter((ser) => {ser.freePkg !== false})
    res.json(allUsed);
};

const addUsedServer = async (req, res, next) => {
    const userIp = req.body.ip;
    const userName = req.body.name;
    const userComment = req.body.comment;
    let userPack, userSer, doc;
    if (req.body.comp === "packages") {
        userPack = false;
        doc = await Server.findOneAndUpdate(
            { ip: userIp },
            { namePkg: userName, freePkg: userPack, pkgComment: userComment },
            { new: true }
        );
    } else if (req.body.comp === "services") {
        userSer = false;
        doc = await Server.findOneAndUpdate(
            { ip: userIp },
            { nameSer: userName, freeSer: userSer, serComment: userComment },
            { new: true }
        );
    } else {
        let cont = { userName: userName, name: req.body.comp, cmnt: userComment };

        let duplicate = await Server.findOne({
            ip: userIp,
            containers: { $elemMatch: { name: req.body.comp } },
        });
        if (duplicate !== null) {
            doc = "duplicate";
        } else {
            doc = await Server.findOneAndUpdate(
                { ip: userIp },
                { $push: { containers: cont } },
                { new: true }
            );
        }
    }
    res.json(doc);
    serverHistoryController.addServerHistory(req, res, next);
};

const removeUsedServer = async (req, res, next) => {
    const userIp = req.body.ip;
    let userPack, userSer, doc;
    if (req.body.comp) {
        if (req.body.comp === "packages") {
            userPack = true;
            doc = await Server.findOneAndUpdate(
                { ip: userIp },
                { namePkg: "", freePkg: userPack, pkgComment: "" },
                { new: true }
            );
        } else if (req.body.comp === "services") {
            userSer = true;
            doc = await Server.findOneAndUpdate(
                { ip: userIp },
                { nameSer: "", freeSer: userSer, serComment: "" },
                { new: true }
            );
        }
    } else {
        doc = await Server.findOneAndUpdate(
            { ip: userIp },
            { $pull: { containers: { name: req.body.cont } } },
            { new: true }
        );
    }
    res.json(doc);
};

exports.getAllServers = getAllServers;
exports.addUsedServer = addUsedServer;
exports.getAllUsedServers = getAllUsedServers;
exports.removeUsedServer = removeUsedServer;
