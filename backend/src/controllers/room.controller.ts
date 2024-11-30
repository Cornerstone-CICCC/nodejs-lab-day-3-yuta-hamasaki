import { Request, Response } from 'express';
import { Chat } from '../models/chat.model';

export const getMessagesByRoom = async (req: Request, res: Response) => {
  const room = req.params.room;

  try {
    const messages = await Chat.find({ room }).exec();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
};
