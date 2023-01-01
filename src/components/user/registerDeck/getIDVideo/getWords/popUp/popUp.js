import React,{useState} from 'react';


export default function PopUp(props){

    const [deckName,setDeckName] = useState('');
    const [deckDescription,setDeckDescription] = useState('');
    const [error,setError] = useState(null)

    const auxHandlerInput = {deckName:setDeckName,deckDescription:setDeckDescription}

    const inputPopUpHandler = (e) => auxHandlerInput[e.target.name](e.target.value)
    
    const cancelPopUpBtn = (e) =>{
        e.preventDefault();
        var positionDiv = document.getElementById('description-title-new-deck');
        positionDiv.classList.remove('appear')
    }

    const sendNewDeck = () => {

        if(!(deckName && deckDescription)) {
            setError('Input missing');
            return;
        }

        fetch('/deck/register',{ // ask the users to inform the title and description of the new deck.
            method: 'POST',
            headers:{'Content-type':'application/json'},
            body:JSON.stringify({
                title:deckName,
                description:deckDescription,
                content:props.selectedWords
            })
        })
        .then(res=>res.json())
        .then(res => {
            if(res.error){
                setError(res.error)
            }else{
                window.alert('The deck has successfully been created.');
                var positionDiv = document.getElementById('description-title-new-deck');
                positionDiv.classList.remove('appear')

            }
        })

    }


    return <>
    <div id="description-title-new-deck">
        <button id="cancel-pop-up" onClick={(e )=>cancelPopUpBtn(e)}>X</button>
        <h2>Fill the inputs to create a new deck </h2>
        <label htmlFor="title-deck">Nome do deck</label>
        <input type="text" id="title-deck" value={deckName} name="deckName" onChange={e => inputPopUpHandler(e)}  className='new-deck-inputs' required/>

        <label htmlFor="description-deck">descrição do deck</label>
        <input type="text" id="description-deck" value={deckDescription} name="deckDescription" onChange={e => inputPopUpHandler(e)} className='new-deck-inputs' required/>
        {error?<p id="pop-up-error">{error}</p>:null}
        <button type = "submit" id="finish-btn" onClick={(e)=> sendNewDeck(e)}>Finalizar</button>
    </div>
    </>
}