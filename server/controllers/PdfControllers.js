const pdfParse = require('pdf-parse');
const translate = require('translate');


const handleText = (splitText) =>{

    const notChange = "”,.;:! 123456789"

    for(var i = splitText.length-2; i >= 5; i--) {
        if(splitText[i][splitText[i].length - 1]==='') continue;
        console.log(splitText[i])
        if(splitText[i][splitText[i].length - 1] === '-'){
            //positionToBeRemoved.push(i+1);
            splitText[i] = splitText[i].replace('-','')+splitText[i+1]
            const removed = splitText.splice(i+1,1);
            console.log(removed)
        }
        
        if(notChange.indexOf(splitText[i][splitText[i].length - 1]) === -1){
            splitText[i] = splitText[i]+splitText[i+1]
            const removed = splitText.splice(i+1,1);
            console.log(removed)

        } 
          
    }
    return splitText
}

const TranslateText = async (splitText)=>{ return splitText.map( async row =>{ 
    const trans = await translate(row[0], "pt")
    console.log(row[0],trans)
    return trans
    })
}

const PdfControllers =  (req,res) =>{

    try{

        if(!(req.files&&req.files.pdfFile)) throw new Error("No PDF");
        
        const options ={
            max:3,
            version: 'v1.10.100'
        }

        pdfParse(req.files.pdfFile,options)
        .then(async result =>{
            //console.log(result.text.split('\n'))
            const handledText = handleText(result.text.split('\n'))
            console.log(handledText)
            const translated = await translate(handledText, "pt")
            return res.status(200).send({
                error:false,
                PdfText:result.text,
                splitPdfText:handledText,
                translatedText:translated
            });
        })

    }catch(err){
        return res.status(400).send({error:err.message})
    }

}

module.exports = {PdfControllers};