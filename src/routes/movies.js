const express = require("express");
const router = express.Router();
const movieController= require('../controllers/moviecontroller');

router.get('/',movieController.movies);

router.get('/:id',movieController.getMoviebyid('movie_Description'))

module.exports = router;