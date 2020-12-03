const users = [];

// Faire rejoindre au chat un utilisateur
const userJoin = (id, username, room) => {
    const user = { id, username, room };

    users.push(user);

    return user;
};

// Retourne l'user courant
const getCurrentUser = (id) => {
    return users.find((user) => user.id === id);
};

// User quitte le chat
const userLeave = (id) => {
    // Trouve la position du user dans le tableau users
    const index = users.findIndex(user => user.id === id);

    // S'il existe, on l'enleve du tableau, et on renvoie le user qui vient de quitter
    if (index !== -1) return users.splice(index, 1)[0];
};

// Retourne les users d'une room
const getRoomUsers = (room) => {
    return users.filter(user => user.room === room);
};

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};
