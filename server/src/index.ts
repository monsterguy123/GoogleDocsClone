import {Server} from 'socket.io'
import dotenv from 'dotenv'
import Document  from './model/document';
import DB from './db/Db'
import {getDocument,updateDocument} from './controller/documentController'
dotenv.config();

//DB setup 
DB();

//server setup
const PORT = 3001
const io = new Server(3001,{
    cors:{
        origin:"*",
        methods:['GET','POST']
    }
});

//io connections
io.on('connection',(socket)=>{  
    socket.on('get-document',async (documentId)=>{
        let data:any = await getDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document',data.document);

        socket.on('save-changes',async delta=>{ 
            socket.broadcast.to(documentId).emit('receive-changes',delta)
       })
       socket.on('save-document',async (data)=>{
            await updateDocument(documentId,data);
       })  
    })
})