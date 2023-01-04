import React,{useState} from 'react';
import './pdfReader.css';
import Phares from './phrases/phrases'


export default function PdfReader(){

    const [pdf,setPDF] = useState(null);
    const [splitPdfText,setSplitPdfText] = useState('');
    const [translatedText,setTranslatedText] = useState([]);
    const [voicesOptions,setVoicesOptions] = useState(window.speechSynthesis.getVoices());
    const [SpeechState,setSpeechState] = useState('Waiting');
    let mypdf = new FormData();

    const handlePdf = (e) =>  setPDF(e.target.files[0])

    const uploadHandler = () =>{

        if(!pdf) return window.alert('PDF not selected');
        mypdf.append('pdfFile',pdf);

        fetch('/pdf/extractText',{
            method:"POST",
            body:mypdf
        })
        .then(res=>res.json())
        .then(res=>{
            console.log(res)
            if (!res.error) {
                setSplitPdfText(res.splitPdfText)
                setTranslatedText(res.translatedText)
            }else{
                console.log(res.error)
            }
        })
    }

    //https://www.youtube.com/watch?v=enfZAaTRTKU

    async function speak(content){

        var rateWords = document.getElementById('rate-input');
        //var notSupported = document.getElementById('not-supported');
        if('speechSynthesis' in window){

            const synth = window.speechSynthesis;
            setVoicesOptions(synth.getVoices())
            const utterThis = new SpeechSynthesisUtterance(content);
    
            utterThis.rate = rateWords.value;
            utterThis.lang = "en-US";
            
            await synth.speak(utterThis);
        }else{
            console.log("Web Speech API not supported :-(")
           // notSupported.hidden = false;
        }
        return true;
    }

    const SpeakText = (e)=>{

        e.preventDefault();
        setSpeechState('Speaking')
        var count = 0;
        if(e.target?.id){
            while(true){
                speak(splitPdfText[parseInt(e.target.id.split('-')[0])+count])
                count+=1;
                if(count>=5) break;  
            }   
        }else{
            while(true){
                speak(splitPdfText[parseInt(e.target.parentElement.id.split('-')[0])+count])
                count+=1;
                if(count>=5) break;  
            }   
        }
    }

    const displayTranslation = (e) =>{
        e.preventDefault();

        if(e.target?.id){
            const currentPosition  = e.target.id.split('-')[0]
            const getPhrase = document.getElementById(currentPosition+'-translated-p');
            getPhrase.classList.contains('appear')?getPhrase.classList.remove('appear'):getPhrase.classList.add('appear');
        }else{
            const currentPosition  = e.target.parentElement.id.split('-')[0]
            const getPhrase = document.getElementById(currentPosition+'-translated-p');
            getPhrase.classList.contains('appear')?getPhrase.classList.remove('appear'):getPhrase.classList.add('appear');
        }

    }

    return(
        <section id="pdf-section">
            <div id="input-button-div">
                <input type="file" onChange={handlePdf} id="in-file"/>
                <button type="button" onClick={uploadHandler} id="btn-upload" accept=".pdf">Upload</button>
            </div>
            <br/>
            <p id="test-p-text"></p>
            <div id="text-div">
                <div id="header-speak">
                    <div id="text-div-btn">
                        <button type='button' id="resume-speaking-btn" className='speaking-btn' onClick={e => {window.speechSynthesis.resume(); setSpeechState('Speaking')}}> Resume </button>
                        <button type='button' id="pause-speaking-btn" className='speaking-btn' onClick={e => {window.speechSynthesis.pause();setSpeechState('Paused')}}> Pause </button>
                        <button type='button' id="stop-speaking-btn" className='speaking-btn' onClick={e =>{window.speechSynthesis.cancel();setSpeechState('Waiting')}}> Stop </button>
                    </div>
                    <div id="range-option-inputs">
                        <input type="range" min="0.2" max="2" defaultValue="1"  step="0.1" id="rate-input"/>
                        
                        {voicesOptions.length!==0?
                        <div>
                        <label htmlFor="voice-options">
                            <input list="voice-options"  id="input-voice-options" placeholder='Click and select language'/>
                        </label>
                        <datalist id="voice-options" >
                            { 
                                voicesOptions.map((voice,index)=>{
                                    return  <option value={voice.name+' '+voice.lang} key={index+'-voice'}/>
                                })
                            }
                        </datalist>
                        </div>:null}
                    </div>
                    <div id="state-speech-div">
                        <p id="state-speech-p">{SpeechState}</p>
                    </div>
                </div>

                <Phares splitPdfText={splitPdfText} translatedText={translatedText} SpeakText={SpeakText} displayTranslation={displayTranslation}/>

            </div>
        </section>
    );

}