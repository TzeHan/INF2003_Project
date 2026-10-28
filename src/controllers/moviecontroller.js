const movieQuery = require('../models/movieModel');

exports.movies = async(req,res)=>{
    res.render('movies');
};

exports.getMovies = (viewName) =>
        async(req,res)=>{
            try{
                const movies = await movieQuery.findAll();
                const currentUser = req.session.user;
                res.render(viewName,{movies:movies,user:currentUser});
            }
            catch(err){
                console.error(err);
                res.status(500).render('error',{error:'Error'})
            }
    };

exports.getMoviebyid = (viewName) =>
        async(req,res) =>{
            try{
                const movie = await movieQuery.findById(req.params.id)
                res.render(viewName,{movie})
            }
            catch(err){
                console.error(err);
                res.status(500).render('error',{error:'Error'})
            }
        };