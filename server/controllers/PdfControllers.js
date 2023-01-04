const pdfParse = require('pdf-parse');
const translate = require('translate');


const handleText = (splitText) =>{

    const notChange = "”,.;:! 123456789"

    for(var i = splitText.length-2; i >= 5; i--) {
        
        if(splitText[i][splitText[i].length - 1]==='') continue;

        if(splitText[i][splitText[i].length - 1] === '-'){
            splitText[i] = splitText[i].replace('-','')+splitText[i+1]
             splitText.splice(i+1,1);
        }
        
        if(notChange.indexOf(splitText[i][splitText[i].length - 1]) === -1){
            splitText[i] = splitText[i]+splitText[i+1]
            splitText.splice(i+1,1);
        } 
          
    }
    return splitText
}

const TranslateText =  (splitText)=>{ return splitText.map(  async row =>{
    if(row){
        const trans = translate(row, "pt")
        console.log(trans)
        return trans
    } 
    return ''
    })
}

const PdfControllers = async (req,res) =>{

    try{

        if(!(req.files&&req.files.pdfFile)) throw new Error("No PDF");
        
        const options ={
            max:3,
            version: 'v1.10.100'
        }

        const result = await pdfParse(req.files.pdfFile,options)
        const handledText = await handleText(result.text.split('\n'))
        const translated = await TranslateText(handledText)

        Promise.all([...translated]).then((wordsTranslated)=>{
            return  res.status(200).send({
                error:false,
                splitPdfText:handledText,
                translatedText:wordsTranslated
            });
        })

    }catch(err){
        return res.status(400).send({error:err.message})
    }

}

module.exports = {PdfControllers};