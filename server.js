const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
//const fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));


const botName = 'ChatCord';

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/chat', (req, res) => {
    res.render('chat');
})

// Executé quand un client se connecte
io.on('connection', (socket) => {

    // Ecoute l'event joinRoom
    socket.on('joinRoom', ({username, room}) => {
        // Crée l'objet user
        const user = userJoin(socket.id, username, room);

        // Rejoindre la room
        socket.join(user.room);

        // Message de bienvenue (socket.emit ne diffuse qu'à la socket concernée)
        socket.emit('message', formatMessage(botName,'Welcome To ChatCord'));

        // Diffuse l'information à tous les clients sauf à l'expéditeur
        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat`));

        // Diffuser à tous le nom de la room et la liste des users
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });


    // On écoute l'évènement chatMessage
    socket.on('chatMessage', (msg) => {
        // On récupère l'user et ses infos depuis l'ID de la socket
        const user = getCurrentUser(socket.id);

        // io.emit diffuse à tous les clients connectés
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Executé quand un client se déconnecte
    socket.on('disconnect', () => {
        // On récupère l'user qui se déconnecte
        const user = userLeave(socket.id);

        // On informe sa room, de son départ et on actualise la liste des users
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
});


server.listen(3000, () => {
    console.log(`on écoute sur le port 3000`)
});