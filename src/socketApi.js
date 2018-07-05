const  socketio = require('socket.io');
const io = socketio();

const socketApi = { };
socketApi.io = io;

const users = { };

//helpers
const randomColor = require('../helpers/randomColor');

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('new-user', ( data ) => {
        //console.log(data);
        const defaultData = {
          id : socket.id,
          position : {
              x : 0,
              y : 0
          },
            color : randomColor()
        };
        const userData =  Object.assign(data,defaultData);
        //console.log(userData);
        users[socket.id ]  = userData;
       console.log(users);

        socket.broadcast.emit('newUser',users[socket.id]);
        socket.emit('initPlayers',users);

    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('disUser', users[socket.id]);
        delete  users[socket.id];
        console.log(users);
    });

    socket.on('animate', ( data ) => {
        console.log(users);
        users[socket.id].position.x = data.x;
        users[socket.id].position.y = data.y;

        socket.broadcast.emit('animate',
            {
                socketId : socket.id,
                x : data.x ,
                y : data.y
            });

    });

    socket.on('newMessage', (data) => {
        //console.log(data);
        socket.broadcast.emit('newMessage',data);
    });

});

module.exports = socketApi;