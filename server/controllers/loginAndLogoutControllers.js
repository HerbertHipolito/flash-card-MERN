const bcrypt = require('bcrypt');
require('dotenv').config();
const users = require('../model/user');

const loginControler = async (req,res)  =>{

    try{
        if(req?.session?.authenticated) throw new Error('User is already authenticated');
        if(!req.body?.login || !req.body?.password  ) throw new Error('input missing');
    
        const user = await users.findOne({login:req.body.login});
        if(!user) throw new Error('Login or password not found');
        const match = await bcrypt.compare(req.body.password,user.password);
        if(!match) throw new Error('Login or password not found');
    
        req.session.authenticated = true;
        req.session.user = {
            "name":user.fullName,
            "role":user.role,
            "login":user.login
        };

        return res.status(200).send({error:null});
        
    }catch(err){
        console.log(err)
        return res.status(400).send({error:err.message})

    }
}

const logoutController = (req,res) =>{

    if(req.session.authenticated){
        req.session.destroy(
            (error)=>{
                res.clearCookie(process.env.DATABASE_NAME);
                return res.status(200).send({error:null});
            }
        )
    }else{
        console.log('You are not logged');
        return res.status(400).send({error:'You are not logged'})
    }

}

module.exports = {loginControler,logoutController}