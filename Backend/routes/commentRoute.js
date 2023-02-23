const express = require('express');

const commentControllers = require('../controllers/commentController');

const router = express.Router();

router.get('/all', commentControllers.getAllComments);

router.post('/add', commentControllers.addComment);

router.post('/remove', commentControllers.removeComment);

module.exports = router;