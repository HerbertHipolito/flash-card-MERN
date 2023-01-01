const decks = require('../model/deck');
const translate = require('translate');
const {format} =  require('date-fns');


function SplitingContant(content){

    // The symbols chosen to split the content string is # and :

    var array = content.split("#");
    var object = [];
    var inputError = false;

    for( var element of array){ //validating the input content.

        var count = 0;

        for(var letter of element){

            if(letter === ':') count+=1;
            if(count>1) break;    
        
        }

        if(count!==1){     
            inputError = true;
            break;
        }
    }

    if(!inputError){

        for(let i=0;i<array.length;i++){
        
            var card = array[i].split(":");
            
            object.push({
                'nameCard':card[0],
                'result':card[1],
                'learned':false,
                'hits':0,
                'failure':0
            });
    
        }
    
        return object;

    }else{
        return null
    }

}

const registerNewDeck = async (req,res) =>{

    try{
        if(!(req.body?.title && req.body?.description )) throw Error('Input missing');

        const duplicate = await decks.findOne({title:req.body.title});

        if(duplicate) throw Error('Deck title already exists');

        const dateNow = `${format(new Date(),'MM/dd/yyyy HH:mm:ss')}`;
        
        //if(req.body?.content) content = SplitingContant(req.body.content);
        var translatedwords = await translate(req.body.content, "pt");
        translatedwords = translatedwords.split(",");

        const newWordsAndTranslations = req.body.content.map((word,index) =>{

            return ({
                nameCard:word,
                result:translatedwords[index],
                learned:false,
                hits:0,
                failure:0
            })

        })

        const result = await decks.create({
            "title":req.body.title,
            "description":req.body.description,
            "author":req.session.user.login,
            "date":dateNow,
            "content":newWordsAndTranslations,
            "used":0
        });
        
        if(!result) throw Error('Error during deck creation');

        return res.status(200).send({error:false});

    }catch(err){
        console.log(err);
        return res.status(400).send({error:err.message});
    }

}

const getMyDecks = async (req,res) =>{

    try{

        var myDecks = await decks.find({author:req.session.user.login}).limit(10);

        if(!myDecks) throw Error('decks not found');

        myDecks = myDecks.map((deck,index) =>{
            const newData = `${format(deck.date,'dd/MM/yyyy')}`;
            deck = {_id:deck._id,index,title:deck.title,description:deck.description,used:deck.used,date:newData}
            return deck
        })

        return res.status(200).send({error:false,myDecks});

    }catch(err){
        return res.status(400).send({error:err.message})
    }

}

module.exports = {registerNewDeck,getMyDecks}