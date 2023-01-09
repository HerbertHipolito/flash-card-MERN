import './myDeck.css'
import React,{useState,useEffect} from "react";
import { useNavigate } from 'react-router-dom';


export default function MyDeck(){

    const [decks,decksSet] = useState([]);
    const navigate = useNavigate()

    useEffect(()=>{

        const myFetch = async ()=>{
            
            await fetch('/deck/myDeck')
            .then(res=>res.json())
            .then(res=>{
                if(!res.error){
                    decksSet(res.myDecks)
                }else{
                    console.log('Something went wrong')
                    }
                })
            }

        myFetch()

    },[])

    return (<>
        <section id="myDeck-section">
            <p id="myDeck-title">Your Decks</p>
            <div id="myDeck-redirect-div">
                <button id="myDeck-redirect-btn" onClick={() =>navigate('/deck/selectVideo')} >Register a new deck or words</button>
            </div>
            <div id="deck-list">
            
                {
                    
                    decks.map((deck)=>{
                    
                    return <a  key={deck.index+"deck"} href={'/'+deck._id} className='link-a' > 
                        <div key={deck.index+"deckitself"} className="deck-itself">
                            <p key={deck.index+'title'} className="deck-title">{deck.title}</p>
                            <p key={deck.index+'description'} className="deck-description">Descrição: {deck.description}</p>
                            <div key={deck.index+'div'}>
                                <p className="deck-data" key={deck.index+'divp'}>Data de registro: {deck.date}</p>
                                <p className="deck-used" key={deck.index+'divp2'}>Tentativas: {deck.used}</p>
                            </div>
                        </div>
                        </a>
                    })
                   
                }
             
            </div>

        </section>
        </>
    )

}