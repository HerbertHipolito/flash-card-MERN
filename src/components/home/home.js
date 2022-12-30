import React from 'react';
import './home.css';
import MyDeck from '../user/myDeck/myDeck';

export default function Home(props){

    return (<>
        <section id="home">
            
            <p id="body-text-title">Why should i use Flashcards?</p>
            <p id="body-text-explanation">Flashcards are handy and simple tools to learn a new subject or evolve your vocabulary in another language quickly. Here, you define a set of words and 
                see and review them periodically in order to learn them. Check out our features and enjoy!
            </p>
            <p id="body-text-scroll">Scroll down to see how we work</p>
        
        </section>
        {
            (props.logged && props.logged!=='loading')?<MyDeck/>:null
        }
        </>
    )

}