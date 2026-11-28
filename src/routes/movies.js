
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/moviecontroller');

router.get('/', movieController.movies);

router.get('/movieDetails/:id', movieController.getMoviebyid('movie_Details'));

router.post('/movieDetails/:id/review', movieController.submitReview);

router.get('/purchaseTix/:id', movieController.retrieveBookingDetails);

router.get('/favourite', movieController.retrieveFavs);

router.post('/favourite/:id', movieController.addFavourite);

router.post('/favourite/:id/remove', movieController.removeFavourite);

router.post('/favourites/remove/:id', movieController.removeFavourites);

router.get('/watchHistory', movieController.getWatchHistory);

router.post('/buyTicket', movieController.purchaseTix);

module.exports = router;
