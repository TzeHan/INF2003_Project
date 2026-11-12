const foodQuery = require('../models/foodModel');
const cartQuery = require('../models/cartModel');
const path = require('path');
const fs = require('fs'); 

exports.addFood = async(req,res)=>{
            try{
                const {name,description,category_id,price} = req.body;

                let imageName = null;
                if (req.file) {
                    imageName = req.file.filename + path.extname(req.file.originalname);
                    
                    // Rename the file so it has the extension
                    const fs = require('fs');
                    const oldPath = req.file.path;
                    const newPath = req.file.path + path.extname(req.file.originalname);
                    fs.renameSync(oldPath, newPath);
                }

                const food = {
                    name: name,
                    description: description,
                    price: price,
                    category_id: category_id,
                    image:imageName
                }
                console.log(food);
                const result = await foodQuery.createFood(food);
                 if (result.affectedRows === 0) {
                    return res.status(400).send("Failed to add food.");
                }
                res.redirect('/food/1')
            }
            catch(err){
                console.error(err);
                res.status(500).render('error',{error:'Error'})
            }
};

exports.getFoodPage = async(req, res)=> {
        try{
            if (!req.session.user || req.session.user.type_id != 2) {
                    return res.send('access denied.'); 
            }   
            const categories = await foodQuery.findAllCategory()
            res.render('admin_create_food',{ categories: categories })
        }
        catch(err){
            console.error(err);
            res.status(500).render('error',{error:'Error'})
        }
};

exports.getFoodDetail = async(req,res) =>{
    try{
        if (!req.session.user || req.session.user.type_id != 2) {
            return res.send('access denied.'); 
        }
    const food = await foodQuery.findFoodById(req.params.id);
    const categories = await foodQuery.findAllCategory();
    res.render('admin_edit_food', { food: food ,categories: categories});
    }
    catch(err){
            console.error(err);
            res.status(500).render('error',{error:'Error'})
        }
};

exports.updateFood = async (req, res) => {
    try {
        const {product_id,name, description, category_id, price } = req.body;

        const existingFood = await foodQuery.findFoodById(product_id);

        let imageName = existingFood.img;

        if (req.file) {
            imageName = req.file.filename + path.extname(req.file.originalname);
            
            const oldPath = req.file.path;
            const newPath = req.file.path + path.extname(req.file.originalname);
            fs.renameSync(oldPath, newPath);
        }

        const updatedFood = {
            product_id,
            name,
            description,
            price,
            category_id,
            image: imageName
        };

        console.log(updatedFood);

        await foodQuery.updateFood(updatedFood);
        
        res.redirect('/food/1');
        
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { error: 'Error' });
    }
};