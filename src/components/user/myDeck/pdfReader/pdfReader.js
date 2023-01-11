import React,{useState} from 'react';
import './pdfReader.css';
import Phares from './phrases/phrases'
import InputInformation from './input-information/input-informations'


export default function PdfReader(){

    const [voicesOptions,setVoicesOptions] = useState(window.speechSynthesis.getVoices());
    const [SpeechState,setSpeechState] = useState(null);
    const [pdfState,setpdfState] =  useState(null);
    const [allContent,setAllContent] = useState([]);
    const [pharesToSpeakInRow,setPharesToSpeakInRow] = useState(10)

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
                speak(allContent[parseInt(e.target.id.split('-')[0])+count].str)
                count+=1;
                if(count>=pharesToSpeakInRow) break;  
            }   
        }else{
            while(true){
                speak(allContent[parseInt(e.target.parentElement.id.split('-')[0])+count].str)
                count+=1;
                if(count>=pharesToSpeakInRow) break;  
            }   
        }
        setSpeechState('Waiting')
    }

    
    const handlerSpeakText = (e) =>{
        e.preventDefault();

        if(e.target.name === 'resume-btn' && SpeechState === 'Paused') {
            window.speechSynthesis.resume()
            setSpeechState('Speaking');
        }
        else if(e.target.name === 'pause-btn' && SpeechState === 'Speaking'){ 
            window.speechSynthesis.pause()
            setSpeechState('Paused')
        }
        else if(e.target.name === 'stop-btn' && SpeechState){
            window.speechSynthesis.cancel()
            setSpeechState('Waiting')
        }

    }

    return(
        <section id="pdf-section">
           
            <InputInformation setpdfState={setpdfState} setPharesToSpeakInRow={setPharesToSpeakInRow} setAllContent={setAllContent} />
            <br/>
            <p id="test-p-text"></p>
            <div id="text-div">
                <div id="header-speak">
                    <div id="text-div-btn">
                        <button type='button' id="resume-speaking-btn" className='speaking-btn' name="resume-btn" onClick={e => {handlerSpeakText(e)}}> Resume </button>
                        <button type='button' id="pause-speaking-btn" className='speaking-btn' name="pause-btn" onClick={e => {handlerSpeakText(e)}}> Pause </button>
                        <button type='button' id="stop-speaking-btn" className='speaking-btn' name="stop-btn" onClick={e =>{handlerSpeakText(e)}}> Stop </button>
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
                        <p id="state-speech-p">{SpeechState?SpeechState:'Insert the PDF text.'}</p>
                    </div>
                </div>

                {allContent.length !== 0?
                <Phares  allContent={allContent} SpeakText={SpeakText} pdfState={pdfState}/>:
                <p id="text-will-appear">{pdfState?pdfState:'Your text will appear here..'}</p>}
            </div>
        </section>
    );

}