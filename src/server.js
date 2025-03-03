import { Server } from 'socket.io';
import http from 'http';
import chalk from 'chalk';

const server = http.createServer();
const PORT = process.env.PORT || 3001;

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const users = new Map();
const usernameMap = new Map();

io.on('connection', (socket) => {
  console.log(chalk.green(`Client connected: ${socket.id}`));
  
  socket.on('send-message', (message) => {
    if (!message || !message.content) {
      return;
    }
    
    if (message.username && !users.has(socket.id)) {
      const username = message.username.trim();
      const lowerUsername = username.toLowerCase();
      
      if (usernameMap.has(lowerUsername)) {
        const existingSocketId = usernameMap.get(lowerUsername);
        if (existingSocketId !== socket.id && io.sockets.sockets.has(existingSocketId)) {
          socket.emit('receive-message', {
            id: Date.now(),
            username: 'System',
            content: `Error: Username "${username}" is already in use. Please choose another username.`,
            timestamp: new Date().toISOString()
          });
          
          setTimeout(() => {
            socket.disconnect(true);
          }, 1000);
          
          return;
        }
      }
      
      users.set(socket.id, username);
      usernameMap.set(lowerUsername, socket.id);
      
      console.log(chalk.blue(`User registered: ${username} (${socket.id})`));
      
      io.emit('receive-message', {
        id: Date.now(),
        username: 'System',
        content: `${username} has joined the chat`,
        timestamp: new Date().toISOString()
      });
    }
    
    const verifiedUsername = users.get(socket.id);
    
    if (verifiedUsername) {
      console.log(chalk.yellow(`Message from ${verifiedUsername}: ${message.content}`));
      
      io.emit('receive-message', {
        id: Date.now(),
        username: verifiedUsername,
        content: message.content,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      console.log(chalk.red(`User disconnected: ${username} (${socket.id})`));
      
      io.emit('receive-message', {
        id: Date.now(),
        username: 'System',
        content: `${username} has left the chat`,
        timestamp: new Date().toISOString()
      });
      
      usernameMap.delete(username.toLowerCase());
      users.delete(socket.id);
    } else {
      console.log(chalk.red(`Client disconnected: ${socket.id}`));
    }
  });
});

server.listen(PORT, () => {
  console.log(chalk.green.bold(`======================================`));
  console.log(chalk.green.bold(`WebSocket Chat Server`));
  console.log(chalk.green.bold(`======================================`));
  console.log(chalk.white(`Server is running on port ${PORT}`));
  console.log(chalk.white(`Connect clients to: ws://localhost:${PORT}`));
  console.log(chalk.green.bold(`======================================`));
});