const router = require('express').Router()
const {loginControler,logoutController} = require('../controllers/loginAndLogoutControllers');

router.post('/checkLogin',(req,res)=>{
    if(req.session.authenticated) return res.status(200).send({error:false,msg:'you are authenticated'})
    return res.send({error:'access denied'})
})

router.post('/login', loginControler);
router.get('/logout', logoutController);

module.exports = router;
