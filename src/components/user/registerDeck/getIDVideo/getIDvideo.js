import React,{useState} from 'react';
import './getIDvideo.css';
import GetWords from './getWords/getWords.js';

export default function GetIdVideo(){

   const [youtubeLink,setYoutubeLink] = useState('');
   const [youtubeWords,setYoutubeWords] = useState([]);
   const [loading,setLoading] = useState(false);
   const [Error,setError] = useState(null);
   
   const handleYoutubeLink = (e) => setYoutubeLink(e.target.value)   

   const getWordsFetch = () => {
    setLoading(true)
    const OnlyIdVideo = youtubeLink.split('=')

    fetch('/deck/youtubeLink/'+OnlyIdVideo[1])
    .then(res=>res.json())
    .then(res=>{
        if(res.error){
            setError(res.error)
        }else{
            setYoutubeWords(res.data);
            setYoutubeLink('');
            console.log(res.data)
        }
        setLoading(false)
    })
    }

    return (

        <section id="get-id-video">

            <div id="link-div">
                <h1 id="id-tutorial">Copy and paste just the Youtube video link </h1>
                <input type='text' value={youtubeLink} onChange={handleYoutubeLink} id='get-youtube-link-input' placeholder="youtube link" required/>
                {Error?<p id="error-p">Error</p>:''}
                {loading?<p id="loading-p">Loading...</p>:''}
                <button type="button" id="get-youtube-link-btn" onClick={getWordsFetch}>Get words</button>
            </div>
            
            {youtubeWords.length!==0? <GetWords youtubeWords={youtubeWords}/>:null}
        
        </section>

    )

}