import { Box } from "@mui/material";
import { styled } from "@mui/system";
import Quill from 'quill/dist/quill'; 
import 'quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import {io} from 'socket.io-client'
import '../App.css'
import { useParams } from "react-router-dom";

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
];

const Container = styled('div')(
    {
        background:'#F5F5F5'
    }
)

const Editor = () => {

    const [socket,setSocket] = useState();
    const [quill , setQuill] = useState();
    const {id} = useParams();


    useEffect(() => {
        console.log("Initializing Quill...");
        return () => {
            const quillServer = new Quill('#container', { 
                theme: "snow",
                modules: {
                    toolbar: toolbarOptions
                } 
            });
            quillServer.disable();
            quillServer.setText("Document is loading plz wait...")
            setQuill(quillServer);
        };
    }, []);

    useEffect(()=>{
        const socketServer = io('http://localhost:3001');
        setSocket(socketServer);

        return ()=>{
            socketServer.disconnect();
        }
    },[])

    useEffect(()=>{

        if(socket == null || quill == null) return;

        quill && quill.on('text-change', (delta, oldDelta, source) => {
               if(source !== "user") return;
               socket && socket.emit('save-changes',delta)
          });

          return ()=>{
              quill && quill.of('text-change', (delta, oldDelta, source) => {
                  if(source !== "user") return;
                   socket && socket.emit('save-changes',delta)
               });
          }
    },[quill,socket])

    useEffect(()=>{

        if(socket == null || quill == null) return;

        socket && socket.on('receive-changes', (delta) => {
               quill && quill.updateContents(delta)
          });

          return ()=>{
              socket && socket.off('receive-changes', (delta) => {
                   quill && quill.updateContents(delta)
               });
          }
    },[quill,socket])

    useEffect(()=>{
        if(socket === null || quill === null) return null;

        socket && socket.emit('get-document',id);

        socket && socket.once('load-document',document=>{
              quill.setContents(document);
              quill.enable();
        })

    },[socket,quill,id])

    useEffect(()=>{
       
        if(socket === null || quill === null) return;

       const interval = setInterval(()=>{
            socket.emit('save-document',quill.getContents());
        },2000)

        return ()=>{
            clearInterval(interval);
        }
    },[socket,quill])

    return (
        <Container>
            <Box  id='container'></Box>
        </Container>
    )
}

export default Editor;
