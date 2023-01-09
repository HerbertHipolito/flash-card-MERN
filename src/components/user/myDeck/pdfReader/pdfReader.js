import React,{useState} from 'react';
import './pdfReader.css';
import Phares from './phrases/phrases'


export default function PdfReader(){

    const [pdf,setPDF] = useState(null);
    const [voicesOptions,setVoicesOptions] = useState(window.speechSynthesis.getVoices());
    const [SpeechState,setSpeechState] = useState('Waiting');
    const [initialPage,setInitalPage] = useState(0);
    const [lastPage,setLastPage] = useState(5);
    const [pdfState,setpdfState] =  useState(null);
    const [allContent,setAllContent] = useState([]);


    let mypdf = new FormData();

    const handlePdf = (e) =>  setPDF(e.target.files[0])

    const inputPagesHandler = (e) =>  e.target.id === "input-initial-page"?setInitalPage(e.target.value):setLastPage(e.target.value)


    const uploadHandler = () =>{

        if(!pdf) return window.alert('PDF not selected');
        if(initialPage>lastPage) return window.alert('First page is greater than last page');
        if(initialPage<0) return window.alert('First page is less than 0');

        setpdfState('Loading')
        
        mypdf.append('pdfFile',pdf);
        mypdf.append('initialPage',initialPage);
        mypdf.append('lastPage',lastPage);

        fetch('/pdf/extractText',{
            method:"POST",
            body:mypdf
        })
        .then(res=>res.json())
        .then(res=>{
            console.log(res)
            if (!res.error) {
                setAllContent(res.allContent)
            }else{
                console.log(res.error)
            }
            setpdfState(null)
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
                speak(allContent[parseInt(e.target.id.split('-')[0])+count].str)
                count+=1;
                if(count>=5) break;  
            }   
        }else{
            while(true){
                speak(allContent[parseInt(e.target.parentElement.id.split('-')[0])+count].str)
                count+=1;
                if(count>=5) break;  
            }   
        }
    }

    
    return(
        <section id="pdf-section">
            <div id="input-button-div">
                <div id="file-btn-input">
                    <input type="file" onChange={handlePdf} id="in-file"/>
                    <button type="button" onClick={uploadHandler} id="btn-upload" accept=".pdf">Upload</button>
                </div>
                
                <div id="first-final-page-inputs">

                    <input type="text" value={initialPage} id="input-initial-page" onChange={inputPagesHandler} placeholder="First page"/>
                    <input type="text" value={lastPage}  id="input-initial-last" onChange={inputPagesHandler} placeholder="Last page"/>

                </div>

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

                {allContent.length !== 0?
                <Phares  allContent={allContent} SpeakText={SpeakText} pdfState={pdfState}/>:
                <p id="text-will-appear">{pdfState?pdfState:'Your text will appear here..'}</p>}
            </div>
        </section>
    );

}