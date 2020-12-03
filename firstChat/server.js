const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
//const fs = require('fs');

app.set('view engine', 'ejs');


//app.use(express.static('public'));



app.get('/', (req, res) => {
    res.render('index');
   /* io.on('connection', (socket) => {
        console.log('a user connected');
    })*/
});

//app.get('/socket', (req, res) => {
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('disconnect', (socket) => {
            console.log('a user disconnected');
        });

        socket.on('chat message', (message) => {
            console.log(`message recu : ${message}`);
            io.emit('chat message', message);
        })
    });
//})

server.listen(3000, () => {
    console.log(`on écoute sur le port 3000`)
});