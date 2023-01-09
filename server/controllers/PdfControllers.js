//const pdfParse = require('pdf-parse');
const PDFExtract = require('pdf.js-extract').PDFExtract;



const handleText2 = (splitText) =>{ //continue from here. undefine error

    const notChange = "”,.;:! 123456789"

    for(var i = splitText.length-2; i >= 2; i--) {

        if(splitText[i].str[splitText[i].str.length - 1]==='') continue;
        
        if(splitText[i].str===' '){
            splitText.splice(i,1);
            continue;
        }

        if(splitText[i].str[splitText[i].str.length - 1] === '-'){
            splitText[i].str = splitText[i].str.replace('-','')+splitText[i+1].str
             splitText.splice(i+1,1);
        }
        
        if(notChange.indexOf(splitText[i].str[splitText[i].str.length - 1]) === -1){
            splitText[i].str = splitText[i].str+' '+splitText[i+1].str
            splitText.splice(i+1,1);
        } 
          
    }
    return splitText
}


const PdfControllers = async (req,res) =>{

    try{
        const pdfExtract = new PDFExtract();

        if(!(req.files&&req.files.pdfFile)) throw new Error("No PDF");
        
  
        const {initialPage,lastPage} = req.body;

        if (initialPage<0) throw new Error("First page less than zero");
        if (initialPage>lastPage) throw new Error("First greater than last page");


        await pdfExtract.extractBuffer(req.files.pdfFile.data,{firstPage:+initialPage,lastPage:+lastPage},async (error,data)=> { //finish that implementatin

            if (error) throw new Error(error.message);

            var allContent = []

            for(var i=0;i<(lastPage-initialPage);i++) { 
                allContent = [...allContent,...handleText2(data.pages[i].content)]
            }

            return  res.status(200).send({
                error:false,
                allContent
            });
        })

        
    }catch(err){
        console.log(err.message)
        return res.status(400).send({error:err.message})
    }

}

module.exports = {PdfControllers};