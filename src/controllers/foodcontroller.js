const foodQuery = require('../models/foodModel');
const cartQuery = require('../models/cartModel');

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

exports.addToCart = async(req,res)=>{
            try{
                if (!req.session.user) {
                    return res.redirect('/login'); 
                }
                const {id,qty} = req.body;
                const userId = req.session.user.user_id;
                const cart_Details = {
                    user_id: userId,
                    product_id:id,
                    qty:qty
                };
                console.log(cart_Details);
                const duplicatedFood = await cartQuery.getDuplicatedFoodinCart(cart_Details.user_id,cart_Details.product_id)
                if (!duplicatedFood){
                    const result = await cartQuery.addToCart(cart_Details);
                }
                else{
                    const result = await cartQuery.updateQty(duplicatedFood.cart_id,parseInt(cart_Details.qty) + duplicatedFood.qty)
                }
                res.redirect('/food/1'); 
            }
            catch(err){
                console.error(err);
                res.status(500).render('error',{error:'Error'})
            }
};

exports.getCart = async(req,res)=>{
            try{
                if (!req.session.user) {
                    return res.redirect('/login'); 
                }
                const userId = req.session.user.user_id;
                const cartItems = await cartQuery.getCartbyUserId(userId);
                let subtotal = 0;
                cartItems.forEach(item => {
                    subtotal += parseFloat(item.price) * parseInt(item.qty);
                });
                res.render('cart',{cartItems,subtotal}); 
            }
            catch(err){
                console.error(err);
                res.status(500).render('error',{error:'Error'})
            }
};

exports.updateQty = async(req,res)=>{
            try{
                const {cart_id,action} = req.body;
                const cart = await cartQuery.getCartbyId(cart_id);
                let new_Qty = cart.qty;
                if(action == "increase"){
                    new_Qty++;
                }
                else if(action == "decrease"){
                    new_Qty--;
                }

                if(new_Qty < 1){
                    new_Qty = 1;
                }
                await cartQuery.updateQty(cart_id,new_Qty);
                res.redirect('/cart'); 
            }
            catch(err){
                console.error(err);
                res.status(500).render('error',{error:'Error'})
            }
};

exports.deleteFood = async(req,res)=>{
            try{
                const {cart_id} = req.body;
                console.log(cart_id)
                await cartQuery.deleteFoodfromCart(cart_id);
                res.redirect('/cart'); 
            }
            catch(err){
                console.error(err);
                res.status(500).render('error',{error:'Error'})
            }
};