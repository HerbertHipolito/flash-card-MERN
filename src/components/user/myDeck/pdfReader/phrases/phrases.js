import React,{useEffect} from 'react';
import { AiTwotoneSound, AiFillEye} from "react-icons/ai";
import translate from 'translate';

export default function Phares(props){

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

    const translatingText =  (splitText)=>{ 
        
        return splitText.map(  row =>{ 
            try{
                const trans = translate(row.str, "pt")
                return trans
            }catch(error){
                console.log(error.message)
                return error
            }})


        }

    const insertTranslations = (phrases) =>{

        const divPhrase = document.querySelectorAll('.phrases-and-translation')

        phrases.map((phrase,index)=>{
            if(phrase){
                var newP = document.createElement('p');
                var TextToAdd = document.createTextNode(phrase)
                newP.appendChild(TextToAdd);
                newP.id = index+'-translated-p';
                newP.classList.add('translated-phares')

                divPhrase[index].appendChild(newP);
            }
            return null;
        })

    }


    useEffect(()=>{
        var translatedContent = translatingText(props.allContent)

        Promise.all(translatedContent.map((contentPromise,index) =>
            contentPromise.catch(error =>{
                return 'nada'
            })
         )).then((translatedPhrases) =>{
            insertTranslations(translatedPhrases)
        })

    },[props.allContent])

    return (
        <>
            {props.allContent.map((chunk,index)=>{
            //if(!chunk.str) return null
            return <div key={index+"-div"} className="div-phrase">
                <div key={index+'-trans'} className='phrases-and-translation'>
                    <p key={index}>{chunk.str}</p>
                </div>
                {chunk.str?<div key= {index+'-btn-phrase'} className='btn-phrase'>
                    <AiTwotoneSound id={index+"-hear"} onClick={e => props.SpeakText(e)} className="hear-phrase" />
                    <AiFillEye id={index+"-translated"} onClick={e => displayTranslation(e)} className="translated-phares-p"/>
                </div>:null}
            </div>
            })}
        </>
    )
}