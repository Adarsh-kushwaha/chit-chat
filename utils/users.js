const users = [];

//join user
const userJoin = (id, username, room) => {
    const user = { id, username, room };
    users.push(user)
    return user;
}

//get current user
const currentUser = (id) => {
    return users.find(user => user.id === id);
}

//remove user
const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//get room
const getRoomUsers = (room) => {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    currentUser,
    removeUser,
    getRoomUsers
}