const movieQuery = require('../models/movieModel.js');

exports.movies = async(req,res)=>{
    res.render('movies');
};

exports.getMovies = (viewName) => {
        async(req,res)=>{
            try{
                const movies = await movieQuery.findAll();
                res.render(viewName,{movies});
            }
            catch(err){
                console.error(err);
                res.status(500).json({error:'Error'})
            }
    }
}
