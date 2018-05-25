const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket) =>{
   console.log('New user connected');

    socket.emit('newMessage',(socket)=>{
        from:'Admin',
        text:'Welcome to the chat app'
    });

    socket.broadcast.emit('newMessage',{
        from: 'Admin',
        text: 'New user joined',
        createdAt: new Date().getTime()
    });
    socket.on('createMessage',(message)=>{
       console.log('createMessage', message);
       io.emit('newMessage',{ //io emits to every single connections all the tabs
            from:message.from,
            text:message.text,
            createdAt:new Date().getTime()
       });


    });

    // socket.broadcast.emit('newMessage',{ //Send to every sockets but socket who sends the message
    //     from:'Hongyu',
    //     text: 'This should work',
    //     createdAt: new Date().getTime()
    // });

   socket.on('disconnected',()=>{
      console.log('User was disconnected');
   });
});

server.listen(port,()=>{
   console.log(`Server is up on ${port}`);
});



