const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and chat room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

//get room and user info
socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

//listening to server
socket.on("message", (message) => {
    console.log(message);
    addMeessage(message);

    //scroll top
    chatMessage.scrollTop = chatMessage.scrollHeight;

})

//message submit
chatForm.addEventListener("submit", (e) => {

    e.preventDefault();

    //get mesaage
    const msg = e.target.elements.msg.value;

    //emit msg to sever
    socket.emit("chatMessage", msg);

    //clear the input
    e.target.elements.msg.value = " ";
    e.target.elements.msg.focus();

})

//add message function
const addMeessage = (message) => {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.userName} <span>${message.time}</span></p> <p class="text">${message.text}</p>`
    document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {
    }
});