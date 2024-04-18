const socketIo = require('socket.io');
const http = require('http');

const server = http.createServer();
const io = socketIo(server);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // You can handle various events here, like joining rooms, disconnecting, etc.
    // For example, if you want to handle disconnection:
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Export the io object for use in other files
module.exports = io;
