const router = require('express').Router()
const {registerNewDeck,getMyDecks} = require('../controllers/deckControllers');
const {getSelectWords,getSelectWordsAndPhrases,postSelectWords} = require('../controllers/youtubeWords');
const {authUsersCard} = require('../middlewares/authUsersCard');
const {isAuthUser} = require('../middlewares/Auth');
const {getAccessDeckController,postAcessDeckController} = require('../controllers/accessDeckControllers');

router.post('/register',isAuthUser, registerNewDeck);
router.get('/youtubeLink/:id',isAuthUser,getSelectWords).post('/youtubeLink/:id',isAuthUser,postSelectWords);
router.get('/youtubeLink/all/:id',isAuthUser,getSelectWordsAndPhrases).post('/youtubeLink/all/:id',isAuthUser,postSelectWords);
//router.get('/youtubeLink/:id',getSelectWords).post('/youtubeLink/:id',postSelectWords);
router.get('/myDeck',isAuthUser,getMyDecks);
router.get('/:id',isAuthUser,authUsersCard,getAccessDeckController).post('/:id',isAuthUser,authUsersCard,postAcessDeckController);

module.exports = router;
