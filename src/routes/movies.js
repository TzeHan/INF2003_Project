const express = require("express");
const router = express.Router();
const movieController= require('../controllers/moviecontroller');


router.get('/',movieController.movies);

router.get('/movieDetails/:id',movieController.getMoviebyid('movie_Details'))

module.exports = router;