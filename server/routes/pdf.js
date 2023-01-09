const router = require('express').Router();
//const {isAuthUser} = require('../middlewares/auth');
const {PdfControllers} = require('../controllers/PdfControllers')

router.post('/extractText',PdfControllers);

module.exports = router;