import React,{useState,useEffect} from 'react';
import PopUp from './popUp/popUp';

export default function GetWords(props){

    const [selectedWords,setSelectedWords] = useState([])
    const [myDecksJSON,setMydeckJSON] = useState([]);
    const [errorGetWords,setError] = useState(null);

    const checkBoxHandler = (e) =>{

        const CheckBoxword = props.youtubeWords.unknownWords[e.target.id]
        console.log(selectedWords)
        if(e.target.checked){
            setSelectedWords([...selectedWords,CheckBoxword])
        }else{
            setSelectedWords(selectedWords.filter(word => word !== CheckBoxword))
        }
    }

    const addWordsIntoDeck = (deckName)=>{ //Test more that function.

        console.log(selectedWords)
        fetch('/deck/youtubeLink/:id',{
            method: 'POST',
            headers:{'Content-type':'application/json'},
            body:JSON.stringify({selectedWords,deckName})
        })
        .then(res=>res.json())
        .then(res => {
            if(res.error){
                console.log(res.error)
                setError(res.error)
            }else{
                window.alert('The deck has successfully been created.')
            }
        })
    }

    const sendWordsHandler = () =>{

        const deckTitle = document.getElementById('input-deck').value
        console.log(deckTitle)
        if(!deckTitle) return;
        if(selectedWords.length===0){
            window.alert('Please select at least one word.');
            return;
        }
        if(deckTitle === 'Create a new one'){
            setNewDeckData()
        }else{
            addWordsIntoDeck(deckTitle)
        }
    }

    useEffect(()=>{

        fetch('/deck/myDeck')
        .then(res=>res.json())
        .then(res => {
            console.log(res)
            console.log(res.error)
            if(!res.error) setMydeckJSON(res.myDecks)
        })

    },[])

    const setNewDeckData = () =>{

        var positionDiv = document.getElementById('description-title-new-deck');
        const myCurrentScroll = document.documentElement.scrollTop || document.body.scrollTop;

        positionDiv.classList.add('appear')
        positionDiv.style.bottom = (-myCurrentScroll+window.screen.availHeight/2)+'px';
        
    }

    return (<>
        <div id="words-div">
            {props.youtubeWords.unknownWords.map((word,index) =>{//use index in map function to identify the words selected by the user.
                return <div className="word-div" key={word+'div'}> 
                    <p className="word-p" key={word+'p'}>{word}</p>
                    <input type="checkbox" id={index} onClick={checkBoxHandler} name="radio-hidden" value="hide"/>
                </div>
            })}
        </div>
        {errorGetWords?<p id="error">{errorGetWords}</p>:null}

        <PopUp selectedWords={selectedWords}/>
        
        <div id="datalist-div">
            <div id="datalist-div-2">
                <label htmlFor="decks">
                    Choose a deck to add the selected words:
                    <input list="decks" name="decksas-name" id="input-deck" placeholder='Click and select the name dack'/>
                </label>
                <datalist id="decks" >
                <option value='Create a new one' />
                {
                    myDecksJSON.map((deck,index)=>{
                        return  <option value={deck.title} key={index}/>
                    })
                }
                </datalist>
                {/*<button onClick={setNewDeckData}>Just to test</button>*/}
                <button id="send-words-btn" onClick={sendWordsHandler}>Enviar</button>
            </div>
        </div>
        </>  
    )

}