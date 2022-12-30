require('dotenv').config();

const isAuthUser = (req,res,next) =>{
    (req.session.authenticated && req.session.user.role === process.env.DATA_USER_ROLE)? next(): res.status(400).send({error:'unauthorized access'});

}

const isAuthAdmin = (req,res,next) =>{
    (req.session.authenticated && req.session.user.role === process.env.DATA_ADMIN_ROLE)? next(): res.status(400).send({error:'unauthorized access'});
}


module.exports = {isAuthUser,isAuthAdmin}