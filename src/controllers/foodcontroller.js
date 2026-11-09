const foodQuery = require('../models/foodModel');

exports.getAllfood = (viewName)=>
        async(req,res)=>{
            try{
                const food = await foodQuery.findAllFood();
                res.render(viewName,{food})
            }
            catch(err){
                console.error(err);
                res.status(500).render('error',{error:'Error'})
            }
};
