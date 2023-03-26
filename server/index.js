const http = require('http');
const express = require('express');
const cors = require('cors');
//import {user} from "../Join/Join";
const socketIO = require('socket.io');

const app = express();
const port = 4500 || process.env.PORT;

const users = [{}];

app.use(cors); //used for inter communication b/w url

app.get('/', (req, res) =>{
    res.send("hell its working");
})



const server = http.createServer(app);

const io = socketIO(server); ///build connection

//io is circuit and socket is diffrent users
io.on("connection", (socket)=>{///this connect to frontend and get connection messages
    console.log("NEW connection");

   socket.on("joined", ({user})=>{  // on recieve the data
    users[socket.id] = user;
    console.log(`${user} has joined`);
    socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`});
    socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]}`});
})
//broadcast means data send all except user
 socket.on('message',({message,id}) =>{
    io.emit('sendMessage',{user:users[id],message,id}); 
 });

 socket.on("Disconnect",()=>{
    socket.broadcast.emit("leave",{user:"Admin",message:`${users[socket.id] } has  left`});
  console.log("user left");
   });
});

server.listen(port,()=>{
    console.log(`server listening on http://localhost:${port}`);
})