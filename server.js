const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const format = require('./utils/formatMsg');
const { userJoin, currentUser, removeUser, getRoomUsers } = require("./utils/users");
// require("dotenv").config();

const app = express();
const server = http.createServer(app)
const io = socketio(server);

const botName = "Admin"

//staic path to run on port
app.use(express.static(path.join(__dirname, "public")));

//run when clients connect
io.on("connection", (socket) => {

    //join chat room
    socket.on("joinRoom", ({ username, room }) => {

        //user join room
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //welcome to new user
        socket.emit("message", format(botName, "welcome to my chat app"))

        //when user join the chat (broadcast the message)
        socket.broadcast.to(user.room).emit("message", format(botName, `${user.username} has joined the chat`));

        //send user info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })


    //listen to chatMessage
    socket.on("chatMessage", (msg) => {
        const user = currentUser(socket.id);

        //send message to everbody in chat
        io.to(user.room).emit("message", format(user.username, msg));
    })

    //when user disconnect the chat
    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit("message", format(botName, `${user.username} has left the chat`));

            //send user info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => { console.log(`server is running on ${PORT}`) })