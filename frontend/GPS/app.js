const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const data = require("./public/js/data.json")

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine",'ejs');
app.use(express.static(path.join(__dirname,"public")));

io.on("connection",function(socket){
    socket.on("send-location",function(data){
        io.emit("recieve-location",{id:socket.id,...data});
    })
    console.log("connected");

    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id)
        console.log("disconnect")
    })
})

app.get("/",function(req,res){
    // res.send("hello this sagar")
    res.render("index2")
})

app.get("/data",(req,res)=>{
    res.json(data);
})

// const Host = '192.168.56.1';
const port = 3000;

server.listen(port,()=>{
    // console.log(`http://${Host}:${port}/`)
    console.log(`http://localhost:${port}/`)
});