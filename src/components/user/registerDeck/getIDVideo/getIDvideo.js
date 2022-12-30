import React from 'react';
import './getIDvideo.css';

export default function GetIdVideo(){

    return (

        <section id="get-id-video">

            <div id="link-div">
                <h1 id="id-tutorial">Copy and paste just the Youtube video link </h1>
                <input type='text' id='get-youtube-link-input' placeholder="youtube link" required/>
                <button type="button" id="get-youtube-link-btn">Get words</button>
            </div>
            
        </section>

    )

}