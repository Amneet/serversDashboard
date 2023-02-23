const express = require('express');

const serverControllers = require('../controllers/serverController');

const router = express.Router();

router.get('/all', serverControllers.getAllServers);

router.post('/add', serverControllers.addUsedServer);

router.post('/remove', serverControllers.removeUsedServer);

module.exports = router;