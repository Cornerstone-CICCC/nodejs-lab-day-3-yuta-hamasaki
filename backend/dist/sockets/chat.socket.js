"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = require("../models/chat.model");
const setupChatSocket = (io) => {
    io.on('connect', (socket) => {
        console.log(`User connected: ${socket.id}`);
        socket.on('joinRoom', (room) => __awaiter(void 0, void 0, void 0, function* () {
            socket.join(room);
            console.log(`User ${socket.id} joined room: ${room}`);
            const messages = yield chat_model_1.Chat.find({ room }).exec();
            socket.emit('chatHistory', messages);
        }));
        socket.on('leaveRoom', (room) => {
            socket.leave(room);
            console.log(`User ${socket.id} left room: ${room}`);
        });
        socket.on('chat', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { username, message, room } = data;
            try {
                const chat = new chat_model_1.Chat({ username, message, room });
                yield chat.save();
                io.to(room).emit('chat', chat);
            }
            catch (error) {
                console.error('Error saving chat:', error);
            }
        }));
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
exports.default = setupChatSocket;
