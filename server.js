const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3001, () => {
  console.log('listening on *:3001');
});
