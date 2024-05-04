import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    document:{
        type:Object,
        required:true
    }
})

const Document = mongoose.model("document",documentSchema);

export default Document;