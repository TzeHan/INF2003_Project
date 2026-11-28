
const movieQuery = require('../models/movieModel');
const favouriteQuery = require('../models/favouriteModel');
const reviewModel = require('../models/reviewModel');

exports.movies = async (req, res) => {
    res.render('movies');
};

exports.getMovies = (viewName) =>
    async (req, res) => {
        try {
            const movies = await movieQuery.findAll();
            res.render(viewName, { movies: movies });
        } catch (err) {
            console.error(err);
            res.status(500).render('error', { error: 'Error' });
        }
    };

exports.retrieveBookingDetails = async (req, res) => {
    try {
        const movie = await movieQuery.findById(req.params.id);
        const seats = await movieQuery.findSeats(req.params.id);
        const rows = await movieQuery.findDistinctRow(req.params.id);
        console.log(rows);
        res.render('purchaseTix', { movie, seats, rows });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { error: 'Error' });
    }
};

exports.getMoviebyid = (viewName) =>
    async (req, res) => {
        try {
            const movie = await movieQuery.findById(req.params.id);

            if (!movie) {
                return res.status(404).send('Movie not found');
            }

            let isFavourite = false;

            if (req.session.user) {
                const favourite = await favouriteQuery.findByUserAndMovie(
                    req.session.user.user_id,
                    parseInt(req.params.id, 10)
                );
                isFavourite = !!favourite;
            }

            const reviews = await reviewModel.findByMovieId(movie.product_id);

            res.render(viewName, {
                movie,
                isFavourite,
                reviews,
                currentUser: req.session.user || null
            });
        } catch (err) {
            console.error(err);
            res.status(500).render('error', { error: 'Error' });
        }
    };

exports.submitReview = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const movieId = Number(req.params.id);
        const rating = Number(req.body.rating);
        const comment = typeof req.body.comment === 'string'
            ? req.body.comment.trim()
            : '';

        if (!Number.isSafeInteger(movieId) || movieId <= 0) {
            return res.status(400).send('Invalid movie ID');
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).send('Rating must be between 1 and 5');
        }

        if (!comment || comment.length > 1000) {
            return res.status(400).send('Review must contain 1 to 1000 characters');
        }

        const movie = await movieQuery.findById(movieId);

        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        await reviewModel.create({
            movie_id: movieId.toString(),
            user_id: req.session.user.user_id,
            rating,
            comment,
            date: new Date()
        });

        return res.redirect(`/movieDetails/${movieId}`);
    } catch (err) {
        console.error(err);
        return res.status(500).render('error', {
            error: 'Error submitting review'
        });
    }
};

exports.addFavourite = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const userId = req.session.user.user_id;
        const productId = parseInt(req.params.id);

        const existing = await favouriteQuery.findByUserAndMovie(userId, productId);

        if (!existing) {
            await favouriteQuery.create({
                user_id: userId,
                product_id: productId
            });
        }

        res.redirect(`/movieDetails/${productId}`);
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { error: 'Error' });
    }
};

exports.removeFavourite = async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const productId = parseInt(req.params.id);

        await favouriteQuery.remove(userId, productId);

        res.redirect(`/movieDetails/${productId}`);
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { error: 'Error' });
    }
};

exports.removeFavourites = async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const productId = parseInt(req.params.id);

        await favouriteQuery.remove(userId, productId);

        res.redirect('/favourite');
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { error: 'Error' });
    }
};

exports.retrieveFavs = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        let movies = [];
        const fav = await favouriteQuery.findMoviesByUserId(req.session.user.user_id);

        for (const movieId of fav) {
            const movieDetail = await movieQuery.findById(movieId);

            if (movieDetail) {
                movies.push(movieDetail);
            }
        }

        res.render('favourites', { movies: movies });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { error: 'Error' });
    }
};

exports.getWatchHistory = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const history = await movieQuery.getWatchHistory(req.session.user.user_id);

        res.render('watchhistory', { history: history });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { error: 'Error' });
    }
};

exports.purchaseTix = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const { product_id, selectedSeats } = req.body;

        if (!selectedSeats) {
            return res.status(400).send('Please select at least one seat.');
        }

        const seatsArray = Array.isArray(selectedSeats)
            ? selectedSeats
            : [selectedSeats];

        const tixDetails = {
            user_id: req.session.user.user_id,
            product_id: Number(product_id),
            qty: seatsArray.length,
            selectedSeats: seatsArray
        };

        await movieQuery.purchaseTix(tixDetails);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { error: 'Error processing ticket' });
    }
};
