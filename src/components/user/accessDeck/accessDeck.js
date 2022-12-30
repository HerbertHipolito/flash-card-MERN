import './accessDeck.css';
import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom'
import { AiTwotoneSound } from "react-icons/ai";

export default function AccessDeck() {

    const [randomCard, setRandomCard] = useState('loading');
    const [userAnswer, setUserAnswer] = useState('');
    const [stateChanged, setStateChanged] = useState(false);
    
    const userAnswerHandler = (e) => setUserAnswer(e.target.value)

    const revealTriesHandler = (e) =>{

        var elements = document.getElementsByClassName('information-p');
        elements[0].hidden = !elements[0].hidden
        elements[1].hidden = !elements[1].hidden

    }

    const revealTranslationHandler = (e) =>{

        const translation = document.getElementById('card-answser');
        translation.hidden =!translation.hidden

    }

    let { deckId } = useParams();

    const sendAnswer = (e) =>{

        const fetchAnswer = async () =>{
            
            await fetch('/deck/'+deckId,{
                method:'POST',
                headers:{'Content-type':'application/json'},
                credentials:'include',
                body:JSON.stringify({
                    userAnswer,
                    cardButton:e.target.name
                })
            })
            .then(res=>res.json())
            .then(res=>{
                if(!res.error){
                    console.log(res.userAnswerIsCorrect)
                    setStateChanged(true)
                }else{
                    console.log('Something went wrong: '+res.error)
                }
               
            })
        }
         fetchAnswer();
       }

    const hearSpeakHandler = (e) => {
        const cardName = document.getElementById('card-Name')
        speak(cardName)
    }

    useEffect(()=>{

        setStateChanged(false)

        const getDataFetch = async ()=>{
            await fetch('/deck/'+deckId,{
                method: 'GET',
                headers:{'Content-type':'application/json'},
                credentials:'include'
            })
            .then(res=>res.json())
            .then(res=>{
                if(!res.error){
                    console.log(res.data)
                    setRandomCard(res.data)
                }else{
                    console.log('error fetching:'+res.error);
                }
            })
        }
    
        getDataFetch()
        
    },[deckId,stateChanged])

    
    function speak(content){

        var rateWords = document.getElementById('rate-input');
        var notSupported = document.getElementById('not-supported');

        if('speechSynthesis' in window){

            const synth = window.speechSynthesis;
            let ourText = content.textContent;
    
            const utterThis = new SpeechSynthesisUtterance(ourText);

            utterThis.rate = rateWords.value;
            utterThis.lang = "en-US";
            
            synth.speak(utterThis);
    
        }else{
            console.log("Web Speech API not supported :-(")
            notSupported.hidden = false;
        }
    
    }


    
    return <section id="section-play">

        <div id="border-accessDeck">
            <div id="border-box">
                <h1 id="border-title">let's go!</h1>
                <h4 id="border-chosen">The deck chosen is {randomCard?.myDeck?.title}</h4>

                {randomCard ==="loading"?<p>Loading</p>:randomCard?<>
                <div id="card-name-div">
                    <p id = "card-Name" className = "randomCardName">{randomCard.randomCardName}</p>
                    <button type="button" id="hear" onClick = {hearSpeakHandler}><AiTwotoneSound/></button>
                </div>
                <button type="button" id="reveal-button" onClick={revealTranslationHandler}>Reveal the answer</button>
                <p id = "card-answser" hidden={true}>{randomCard.answerRandomCardName}</p>
               
                <div id = "information-div" hidden={false}>
                    <p id = "hit-rate" className = "information-p" hidden={true}>Learning hit: {randomCard.hitRate}</p>
                    <p id = "remaining-card" className = "information-p" hidden={true}>N. of cards remaining:{randomCard.remaingCards}</p>
                </div>

                <div id="rate-control">
                    <label htmlFor="rate-input" id="word-rate">Word rate:</label>
                    <input type="range" min="0.2" max="2" defaultValue="1"  step="0.1" id="rate-input"/>
                </div></>:<p className="randomCardName">All cards has already been learned</p>
                }
                <input type="text" id="card-input" values = {userAnswer} onChange={userAnswerHandler} name="userAnswer" placeholder="Answer" required/>

                <div id="radio-div">
                    <input type="checkbox" id="radio-hidden" name="radio-hidden" value="hide" onClick={revealTriesHandler}/>
                    <label htmlFor="hide"id="radio-text" >Show the information about your tries </label>
                    <p id="not-supported" hidden={true}>The Speech is not supported on your browser</p>
                </div>

                <div id="card-buttons">
                    <button type="submit" onClick={sendAnswer} id="card-buttons-check" className="card-buttons-className" name="Check" defaultValue="Check" >Check</button>
                    <button type="submit" onClick={sendAnswer} className="card-buttons-className" name="I learned it"   defaultValue="I learned it" >Learned</button>
                </div>
            
            </div>
        </div>
        
    </section>


}