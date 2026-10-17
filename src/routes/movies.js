const express = require("express");
const router = express.Router();
const movieController= require('../controllers/moviecontroller');

router.get('/',movieController.movies);

module.exports = router;