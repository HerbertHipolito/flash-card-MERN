import React,{useState,useEffect} from 'react';


export default function GetWords(props){

    const [selectedWords,setSelectedWords] = useState([])
    const [myDecksJSON,setMydeckJSON] = useState([]);
    const [error,setError] = useState(null)

    const checkBoxHandler = (e) =>{

        const CheckBoxword = props.youtubeWords.unknownWords[e.target.id]
        console.log(selectedWords)
        if(e.target.checked){
            setSelectedWords([...selectedWords,CheckBoxword])
        }else{
            setSelectedWords(selectedWords.filter(word => word !== CheckBoxword))
        }
    }

    const addWordsIntoDeck = (deckName)=>{

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
                console.log('terminar isso')
                window.alert('acho q deu certo')
            }
        })


    }

    const sendWordsHandler = () =>{

        const deckTitle = document.getElementById('input-deck').value

        if(deckTitle !== 'Create a new one'){
            addWordsIntoDeck(deckTitle)
        }else{
            fetch('/deck/register',{
                method: 'POST',
                headers:{'Content-type':'application/json'},
                body:JSON.stringify({
                    title:'modificar isso',
                    description:'implementar ainda',
                    content:selectedWords
                })
            })
            .then(res=>res.json())
            .then(res => {
                if(res.error){
                    setError(res.error)
                }else{
                    window.alert('acho q deu certo')
                }
            })
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

    return (<>
        <div id="words-div">
            {props.youtubeWords.unknownWords.map((word,index) =>{//use index in map function to identify the words selected by the user.
                return <div className="word-div" key={word+'div'}> 
                    <p className="word-p" key={word+'p'}>{word}</p>
                    <input type="checkbox" id={index} onClick={checkBoxHandler} name="radio-hidden" value="hide"/>
                </div>
            })}
        </div>

        {error?<p id="erro">{error}</p>:null}
        
        <div id="datalist-div">
            <div id="datalist-div-2">
                <label htmlFor="decks">
                    Choose a deck to add the selected words:
                    <input list="decks" name="decksas-name" id="input-deck"/>
                </label>
                <datalist id="decks" >
                {/*ask here whether the user wants to create a new deck or use existing one */ }
                <option value='Create a new one' />
                {
                    myDecksJSON.map((deck,index)=>{
                        return  <option value={deck.title} key={index}/>
                    })
                }
                </datalist>
                <button id="send-words-btn" onClick={sendWordsHandler}>Enviar</button>
            </div>
        </div>
        </>  
    )

}