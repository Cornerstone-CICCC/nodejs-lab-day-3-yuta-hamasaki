import { Server, Socket } from 'socket.io';
import { Chat } from '../models/chat.model';

const setupChatSocket = (io: Server) => {
  io.on('connect', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);


    socket.on('joinRoom', async (room: string) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);

      const messages = await Chat.find({ room }).exec();
      socket.emit('chatHistory', messages);


    });

    socket.on('leaveRoom', (room: string) => {
      socket.leave(room);
      console.log(`User ${socket.id} left room: ${room}`);

    });

    socket.on('chat', async (data) => {
      const { username, message, room } = data;
      try {
        const chat = new Chat({ username, message, room });
        await chat.save();
        io.to(room).emit('chat', chat);
      } catch (error) {
        console.error('Error saving chat:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default setupChatSocket;
