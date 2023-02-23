const express = require('express');

const nameControllers = require('../controllers/nameController');

const router = express.Router();

router.get('/all', nameControllers.getAllNames);
router.post('/add', nameControllers.addNewName);

module.exports = router;