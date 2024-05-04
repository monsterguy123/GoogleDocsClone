import Document from "../model/document";

export  async function getDocument(id:string){
    try {
        if(id == null) return;

        const document = await Document.findById(id);

        if(document) return document;

        return await Document.create({_id:id , document:""})

    } catch (error) {
        console.log(error)
    }
}

export const updateDocument = async(id:string,data:object)=>{
    try {
        const res = await Document.findByIdAndUpdate(id,{document:data});
       
    } catch (error) {
        console.log(error);
    }
}