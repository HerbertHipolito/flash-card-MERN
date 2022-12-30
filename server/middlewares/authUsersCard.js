
const decks = require('../model/deck');


const authUsersCard = async (req,res,next) =>{

    const myDeck = await decks.findById(req.params.id);
    if(!myDeck) return res.status(400).json({'message':'Deck not found'});
    if(myDeck.author!==req?.session?.user?.login) return res.status(400).send({error:'unauthorized access2'});
    next();

}

module.exports = {authUsersCard}