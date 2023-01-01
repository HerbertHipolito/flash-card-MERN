const translate = require('translate');
const users = require('../model/user');
const decks = require('../model/deck');

function removeDuplicates(Allwords,learnedWords) {
    return Allwords.filter((word,
        index) => learnedWords.indexOf(word) === -1);
}

const getSelectWords = async (req,res) =>{

    const user = await users.findOne({login:req?.session?.user?.login});
    var getSubtitles = require('youtube-captions-scraper').getSubtitles;

    if(!req?.params?.id || req?.params?.id === "") throw new Error("Video id not received");
    if(!user) throw new Error("User not found");

    const allPhases = getSubtitles({
    videoID: `${req.params.id}`,
    lang: 'en' // default: `en`
    }).then(function(captions) {
    
        var textM = captions.reduce((accumulator,text_obj) =>{
            return accumulator + text_obj.text;
        },'')

        textM = textM.replace(/[\r\n]/gm, '');  // Remove line break.
        textM = textM.replaceAll("   "," ").replaceAll("  "," "); // Some phrases may be separated by 1 or 2 space character.
        textM = textM.replaceAll("."," ");   //The captions sometimes have two words gathered by . or , . Then, they are replaced with a space character.
        textM = textM.replaceAll(","," ");
        textM = textM.toLowerCase();

        var words = textM.split(" "); 

        var learnedWords = user.familiarWords;

        words = [...new Set(words)];
        const unknownWords =  removeDuplicates(words,learnedWords)// Remove duplicated words.

        return res.status(200).send({error:false,data:{words,unknownWords}})

    }).catch((err)=>{

        return res.status(400).send({error:err.message+'. Please, check if the video id is correct and try again.'})

    })

}


const getSelectWordsAndPhrases = async (req,res) =>{

    if(!req?.params?.id || req?.params?.id === "") throw new Error("Video id not received");

    var getSubtitles = require('youtube-captions-scraper').getSubtitles;

    const allPhases = getSubtitles({
    videoID: `${req.params.id}`,
    lang: 'en' // default: `en`
    }).then(function(captions) {

        var words = captions.map((phrases_obj) => {

            var text = phrases_obj.text
            text = text.replace(/[\r\n]/gm, '');  // Remove line break.
            text = text.replaceAll("   "," ").replaceAll("  "," "); // Some phrases may be separated by 1 or 2 space character.
            text = text.replaceAll("."," ");   //The captions sometimes have two words gathered by . or , . Then, they are replaced with a space character.
            text = text.replaceAll(","," ");
            text = text.toLowerCase();
            phrases_obj['words'] = text.split(" ");
            return phrases_obj

        })
 
        return res.status(200).send({error:false,data:{words}})

    }).catch((err)=>{

        return res.status(400).send({error:err.message+'. Please, check if the video id is correct and try again.'})

    })

}


const postSelectWords = async (req,res) =>{
    
    if(!req.body) return res.status(400).json({'message':'words not received'});
    try{
        const myDeck = await decks.findOne({author:req.session.user.login,title:req.body.deckName})
        
        delete req.body.deckName
        
        if(!myDeck) throw new Error('deck not found');
        
        var myCards = myDeck.content;        //Getting the old cards
       
        var translatedwords = await translate(req.body.selectedWords, "pt");
        translatedwords = translatedwords.split(",");

        for(let i=0;i<translatedwords.length;i++){ //Joining the cards with the new ones.

            translatedwords[i] = translatedwords[i].replace(' ',''); //removing the space character from the words.
            myCards.push({"nameCard":req.body.selectedWords[i].toLowerCase(),"result":translatedwords[i].toLowerCase(),"learned":false,"hits":0,"failure":0});

        }

        myCards = [...new Map(myCards.map(v => [v.nameCard, v])).values()] // Removing duplicate cards based on the nameCard attribute.
        myDeck.content = myCards;

        const result = await myDeck.save();

        if(!result) throw new Error("Error during deck saving");

        return res.status(200).send({error:false})

    }catch(err){
        console.log(err);
        return res.status(400).send({error:err.message});
    }
    
}

module.exports = {getSelectWords,getSelectWordsAndPhrases,postSelectWords}