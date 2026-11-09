const express = require("express");
const router = express.Router();
const movieController= require('../controllers/moviecontroller');


router.get('/',movieController.movies);

router.get('/movieDetails/:id',movieController.getMoviebyid('movie_Details'))



const reviewModel = require('../models/reviewModel');

// A simple test route
router.get('/test-mongo', async (req, res) => {
    try {
        await reviewModel.create({
            movie_id: "1",
            user_name: "Test User",
            rating: 5,
            comment: "This is a hardcoded test review!",
            date: new Date()
        });
        res.send("✅ Success! Check your MongoDB database.");
    } catch (err) {
        console.error(err);
        res.send("❌ Failed. Check terminal.");
    }
});


module.exports = router;