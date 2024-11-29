import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    message: { type: String, required: true },
    room: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Chat = mongoose.model('Chat', ChatSchema);