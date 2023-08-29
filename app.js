const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server) // specifying the http server
const { v4: uuidv4 } = require('uuid');

// peer server working with express
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);




app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})


// socket io for real time communication...it creates a tube(channel) for continuous data flow...it starts a request when asked by a client
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);
        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
        })
    })
})



server.listen(3030);