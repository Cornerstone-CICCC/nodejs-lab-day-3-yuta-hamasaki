import express from 'express';
import chatController from '../controllers/chat.controller';
import { getMessagesByRoom } from '../controllers/room.controller';

const chatRouter = express.Router();

// Get all chat messages
chatRouter.get('/', chatController.getAllChats);
chatRouter.get('/room/:room', getMessagesByRoom);

export default chatRouter;