import React from 'react';
import { AiTwotoneSound, AiFillEye} from "react-icons/ai";

export default function Phares(props){

    return (
        <>
        {props.splitPdfText?props.splitPdfText.map((chunk,index)=>{
            if(!chunk) return null
            return <div key={index+"-div"} className="div-phrase">
                <div key={index+'-trans'} className='phrases-and-translation'>
                    <p key={index}>{chunk}</p>
                    <p key={index+"translated-p"} id={index+"-translated-p"} className="translated-phares">{props.translatedText[index]}</p>
                </div>
                <div key= {index+'-btn-phrase'} className='btn-phrase'>
                    <AiTwotoneSound id={index+"-hear"} onClick={e => props.SpeakText(e)} className="hear-phrase" />
                    <AiFillEye id={index+"-translated"} onClick={e=>props.displayTranslation(e)} className="translated-phares-p"/>
                </div>
            </div>
            }):<p id="text-will-appear">Your text will appear here..</p>}
        </>
    )
}