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

// Store connected users (socketId -> username)
const users = new Map();
// Track usernames to prevent duplicates (lowercase username -> socketId)
const usernameMap = new Map();

io.on('connection', (socket) => {
  console.log(chalk.green(`Client connected: ${socket.id}`));
  
  // New event specifically for username registration
  socket.on('register-username', (username) => {
    if (!username || typeof username !== 'string') {
      socket.emit('registration-response', {
        success: false,
        message: 'Invalid username format'
      });
      return;
    }
    
    const sanitizedUsername = username.trim();
    const lowerUsername = sanitizedUsername.toLowerCase();
    
    // Check if username is already in use
    if (usernameMap.has(lowerUsername)) {
      const existingSocketId = usernameMap.get(lowerUsername);
      if (existingSocketId !== socket.id && io.sockets.sockets.has(existingSocketId)) {
        // Username is taken
        socket.emit('registration-response', {
          success: false,
          message: `Username "${sanitizedUsername}" is already in use. Please choose another username.`
        });
        return;
      }
    }
    
    // Register the new user
    users.set(socket.id, sanitizedUsername);
    usernameMap.set(lowerUsername, socket.id);
    
    console.log(chalk.blue(`User registered: ${sanitizedUsername} (${socket.id})`));
    
    // Send success response to the user
    socket.emit('registration-response', {
      success: true,
      message: `Welcome, ${sanitizedUsername}!`
    });
    
    // Announce new user to everyone
    io.emit('receive-message', {
      id: Date.now(),
      username: 'System',
      content: `${sanitizedUsername} has joined the chat`,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle messages
  socket.on('send-message', (message) => {
    if (!message || !message.content) {
      return;
    }
    
    // Check if user is registered
    const verifiedUsername = users.get(socket.id);
    
    if (!verifiedUsername) {
      // If not registered, send error
      socket.emit('receive-message', {
        id: Date.now(),
        username: 'System',
        content: 'You must register a username before sending messages.',
        timestamp: new Date().toISOString()
      });
      return;
    }
    
    console.log(chalk.yellow(`Message from ${verifiedUsername}: ${message.content}`));
    
    // Broadcast message with verified username
    io.emit('receive-message', {
      id: Date.now(),
      username: verifiedUsername,
      content: message.content,
      timestamp: new Date().toISOString()
    });
  });
  
  // For backward compatibility with your existing client
  socket.on('send-message-with-registration', (message) => {
    if (!message || !message.content || !message.username) {
      return;
    }
    
    // If user not registered yet, try to register them first
    if (!users.has(socket.id)) {
      const username = message.username.trim();
      const lowerUsername = username.toLowerCase();
      
      // Check if username is already in use
      if (usernameMap.has(lowerUsername)) {
        const existingSocketId = usernameMap.get(lowerUsername);
        if (existingSocketId !== socket.id && io.sockets.sockets.has(existingSocketId)) {
          // Send error only to this socket
          socket.emit('receive-message', {
            id: Date.now(),
            username: 'System',
            content: `Error: Username "${username}" is already in use. Please choose another username.`,
            timestamp: new Date().toISOString()
          });
          return;
        }
      }
      
      // Register the new user
      users.set(socket.id, username);
      usernameMap.set(lowerUsername, socket.id);
      
      console.log(chalk.blue(`User registered: ${username} (${socket.id})`));
      
      // Announce new user to everyone
      io.emit('receive-message', {
        id: Date.now(),
        username: 'System',
        content: `${username} has joined the chat`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get the stored username (prevents spoofing)
    const verifiedUsername = users.get(socket.id);
    
    // Only broadcast if we have a verified username
    if (verifiedUsername) {
      console.log(chalk.yellow(`Message from ${verifiedUsername}: ${message.content}`));
      
      // Broadcast message with verified username
      io.emit('receive-message', {
        id: Date.now(),
        username: verifiedUsername,
        content: message.content,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      console.log(chalk.red(`User disconnected: ${username} (${socket.id})`));
      
      // Announce user leaving
      io.emit('receive-message', {
        id: Date.now(),
        username: 'System',
        content: `${username} has left the chat`,
        timestamp: new Date().toISOString()
      });
      
      // Clean up user records
      const lowerUsername = username.toLowerCase();
      if (usernameMap.get(lowerUsername) === socket.id) {
        usernameMap.delete(lowerUsername);
      }
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