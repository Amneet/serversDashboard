const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    ip: {type: String, required: true},
    namePkg: {type: String, required: true},
    nameSer: {type: String, required: true},
    pkgComment: {type: String, required: true},
    serComment: {type: String, required: true},
    freeSer: {type:Boolean, required: true},
    freePkg: {type:Boolean, required: true},
    isDocker: {type:Boolean, required: true},
    containersUsed: {type:Number, required: true},
    cont1: {type:Object, required: true},
    cont2: {type:Object, required: true},
    cont3: {type:Object, required: true},
    containers: {type: Array, required: true}
});

module.exports = mongoose.model('server', serverSchema);