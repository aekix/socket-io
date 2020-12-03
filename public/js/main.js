const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const usersList = document.querySelector('#users');

// Récupérer l'username et la room depuis l'URL
const { username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const socket = io();


// Rejoindre une room
socket.emit('joinRoom', {username, room});

// Met à jour le nom de la room et la liste des users à chaque arrivée d'un user
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

// Message depuis le serveur
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);

    // Scroll down à chaque message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputText = document.querySelector('#msg');

    // Récupère le message
    const msg = inputText.value;

    // Emet le message au serveur
    socket.emit('chatMessage', msg);

    // Supression du contenu de l'input
    inputText.value = '';
    inputText.focus();
});


// Affiche le message sur le DOM
const outputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}    
    </p>`;
    chatMessages.appendChild(div);
}

// Affiche la room sur le DOM
const outputRoomName = (room) => {
    roomName.innerText = room;
};

// Affiche la liste des users sur le DOM
const outputUsers = (users) => {
    usersList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`
}