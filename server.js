const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3001;

// client と一緒に動かしてるときはそっちが優先される
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/client/build' + req.path);
});

io.on('connection', socket => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('startGame', () => {
    io.sockets.clients((_, clients) => {
      io.emit('startGame', {
        playerCount: clients.length,
        seed: Math.floor(new Date() / 1000),
      });
    });
  });
});

http.listen(PORT, () => {
  console.log('listening on *:' + PORT);
});
