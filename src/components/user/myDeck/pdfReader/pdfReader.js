import React,{useState} from 'react';
import './pdfReader.css';
import { AiTwotoneSound } from "react-icons/ai";


export default function PdfReader(){

    const [pdf,setPDF] = useState(null);
    const [splitPdfText,setSplitPdfText] = useState('');
    const [voicesOptions,setVoicesOptions] = useState([]);
    let mypdf = new FormData();

    const handlePdf = (e) =>  setPDF(e.target.files[0])

    const uploadHandler = () =>{

        //const resultTextBox =  document.getElementById('result-text');
        //const testText = document.getElementById('test-p-text');

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
                //resultTextBox.value = res.PdfText;
                //#testText.innerHTML = res.PdfText;            
                console.log(res.translatedText)
            }
        })
    }

    //https://www.youtube.com/watch?v=enfZAaTRTKU

    async function speak(content){

        var rateWords = document.getElementById('rate-input');
        //var notSupported = document.getElementById('not-supported');
        if('speechSynthesis' in window){

            const synth = window.speechSynthesis;
    
            const utterThis = new SpeechSynthesisUtterance(content);

            //console.log(synth.getVoices()[0].name,synth.getVoices()[0].lang)
            setVoicesOptions(synth.getVoices())

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

        console.log(e.target,e.target.id)
        var count = 0;
        if(e.target?.id){
            while(true){
                speak(splitPdfText[parseInt(e.target.id.split('-')[0])+count])
                count+=1;
                if(count>=5) break;  
            }   
        }
    }

    return(
        <section id="pdf-section">
            <div id="input-button-div">
                <input type="file" onChange={handlePdf} id="in-file"/>
                <button type="button" onClick={uploadHandler} id="btn-upload" accept=".pdf">Upload</button>
            </div>
            {/*<textarea id="result-text" placeholder='Your PDF text will apear here..'></textarea>*/}
            <br/>
            <p id="test-p-text"></p>
            <div id="text-div">
                <div id="text-div-btn">
                    <button type='button' id="resume-speaking-btn" className='speaking-btn' onClick={e => window.speechSynthesis.resume()}> Resume </button>
                    <button type='button' id="pause-speaking-btn" className='speaking-btn' onClick={e => window.speechSynthesis.pause()}> Pause </button>
                    <button type='button' id="stop-speaking-btn" className='speaking-btn' onClick={e => window.speechSynthesis.cancel()}> Stop </button>
                </div>
                <div>
                    <input type="range" min="0.2" max="2" defaultValue="1"  step="0.1" id="rate-input"/>

                    {voicesOptions.length!==0?
                    <datalist id="voice-options" >
                        {console.log(voicesOptions.length)}
                        { 
                            voicesOptions.map((voice,index)=>{
                                return  <option value={`Name: ${voice.name} lang:${voice.lang}`} key={index}/>
                            })
                        }
                    </datalist>:null}
                </div>
                {splitPdfText?splitPdfText.map((chunk,index)=>{
                    if(!chunk) return null
                    return <div key={index+"-div"} className="div-phares">
                    <p key={index}>{chunk}</p>
                    <button key={index+'-hear'} id={index+"-hear"} type="button" onClick={e => SpeakText(e)} className="hear-phares">< AiTwotoneSound id={index+"-hear"} /></button>
                    </div>
                }):<p id="text-will-appear">Your text will appear here..</p>}
            </div>
        </section>
    );

}