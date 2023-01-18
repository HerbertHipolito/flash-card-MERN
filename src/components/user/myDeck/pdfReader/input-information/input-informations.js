import React,{useState} from 'react';


export default function InputInformation(props){

    const [initialPage,setInitalPage] = useState(1);
    const [lastPage,setLastPage] = useState(5);
    const [pdf,setPDF] = useState(null);


    const inputPhrasesHandler = (e) =>  {

        if(e.target.id === "input-initial-page") setInitalPage(e.target.value)
        else if(e.target.id === "input-last-page") setLastPage(e.target.value)
        else props.setPharesToSpeakInRow(e.target.value)

    }

    let mypdf = new FormData();

    const handlePdf = (e) =>  setPDF(e.target.files[0])

    const uploadHandler = () =>{ // move that function to 'input-informations' folder and make all adjustaments needed.

        if(!pdf) return window.alert('PDF not selected');
        if(initialPage>lastPage) return window.alert('First page is greater than last page');
        if(initialPage<0) return window.alert('First page is less than 0');

        props.setpdfState('Loading')
        
        mypdf.append('pdfFile',pdf);
        mypdf.append('initialPage',initialPage);
        mypdf.append('lastPage',lastPage);

        fetch('http://localhost:3500/pdf/extractText',{
            method:"POST",
            body:mypdf
        })
        .then(res=>res.json())
        .then(res=>{
            console.log(res)
            if (!res.error) {
                props.setAllContent(res.allContent)
            }else{
                console.log(res.error)
            }
            props.setpdfState(null)
        })
    }

    return (
        <div id="input-button-div">
            <div id="file-btn-input">
                <input type="file" onChange={handlePdf} id="in-file"/>
                <button type="button" onClick={uploadHandler} id="btn-upload" accept=".pdf">Upload</button>
            </div>
            
            <div id="first-final-page-inputs">
                <div id="first-page-div">
                    <label htmlFor="first-page">First PG.</label>
                    <input type="text" value={initialPage} name="first-page" id="input-initial-page" onChange={inputPhrasesHandler} />
                </div>
                <div id="last-page-div">
                    <label htmlFor="last-page">Last PG.</label>
                    <input type="text" value={lastPage} name="last-page" id="input-last" onChange={inputPhrasesHandler} />
                </div>
                <div id="phrase-to-read-div">
                    <label htmlFor="phrase-to-read">Number of phares</label>
                    <input type="text" value={props.pharesToSpeakInRow} name="phrase-to-read" id="input-phrase-to-read" onChange={inputPhrasesHandler} placeholder='10'/>
                </div>
            </div>
         </div>
    )

}