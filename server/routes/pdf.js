const router = require('express').Router();
const {isAuthUser} = require('../middlewares/auth');
const {PdfControllers} = require('../controllers/PdfControllers')

router.post('/extractText',isAuthUser,PdfControllers);

module.exports = router;