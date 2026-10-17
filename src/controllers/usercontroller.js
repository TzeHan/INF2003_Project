const userQuery = require('../models/userModel');

exports.getUsers = async(req,res)=>{
    try{
        const users = await userQuery.findAll();
        res.render('index', {users});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error: 'Error'})
    }
}