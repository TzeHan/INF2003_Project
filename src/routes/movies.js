const express = require("express");
const router = express.Router();
const movieController= require('../controllers/moviecontroller');

router.get('/',movieController.movies);

router.get('/getMovies',movieController.getMovies);

module.exports = router;