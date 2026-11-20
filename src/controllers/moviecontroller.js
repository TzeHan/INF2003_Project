const movieQuery = require('../models/movieModel');
const favouriteQuery = require('../models/favouriteModel');

exports.movies = async(req,res)=>{
    res.render('movies');
};

exports.getMovies = (viewName) =>
        async(req,res)=>{
            try{
                const movies = await movieQuery.findAll();
                // const currentUser = req.session.user;
                res.render(viewName,{movies:movies});
            }
            catch(err){
                console.error(err);
                res.status(500).render('error',{error:'Error'})
            }
    };

exports.retrieveBookingDetails = async(req,res)=>{
            try{
                const movie = await movieQuery.findById(req.params.id);
                const seats = await movieQuery.findSeats(req.params.id);
                const rows = await movieQuery.findDistinctRow(req.params.id);
                console.log(rows);
                res.render("purchaseTix",{movie,seats,rows});
            }
            catch(err){
                console.error(err);
                res.status(500).render('error',{error:'Error'})
            }
    };

exports.getMoviebyid = (viewName) =>
        async(req,res) =>{
            try{
                const movie = await movieQuery.findById(req.params.id);
                let isFavourite = false;

                if(req.session.user){
                    const favourite = await favouriteQuery.findByUserAndMovie(
                        req.session.user.user_id,
                        parseInt(req.params.id)
                    );
                    isFavourite = !!favourite;
                }

                res.render(viewName,{movie,isFavourite})
            }
            catch(err){
                console.error(err);
                res.status(500).render('error',{error:'Error'})
            }
        };

exports.addFavourite = async(req,res)=>{
    try{
        const userId = req.session.user.user_id;
        const productId = parseInt(req.params.id);

        const existing = await favouriteQuery.findByUserAndMovie(userId, productId);

        if(!existing){
            await favouriteQuery.create({
                user_id: userId,
                product_id: productId
            });
        }

        res.redirect(`/movieDetails/${productId}`);
    }
    catch(err){
        console.error(err);
        res.status(500).render('error',{error:'Error'})
    }
};

exports.removeFavourite = async(req,res)=>{
    try{
        const userId = req.session.user.user_id;
        const productId = parseInt(req.params.id);

        await favouriteQuery.remove(userId, productId);

        res.redirect(`/movieDetails/${productId}`);
    }
    catch(err){
        console.error(err);
        res.status(500).render('error',{error:'Error'})
    }
};