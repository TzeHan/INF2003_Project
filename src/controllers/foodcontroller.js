const foodQuery = require('../models/foodModel');

exports.getAllfood = (viewName)=>
        async(req,res)=>{
            try{
                const food = await foodQuery.findFoodByCategory(req.params.id);
                const categories = await foodQuery.findAllCategory();
                res.render(viewName,{food,categories})
            }
            catch(err){
                console.error(err);
                res.status(500).render('error',{error:'Error'})
            }
};
