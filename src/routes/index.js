const express = require("express");
const router = express.Router();
const path = require('path');
const movieController = require('../controllers/moviecontroller');

router.get('/', movieController.getMovies('index'));

module.exports = router;