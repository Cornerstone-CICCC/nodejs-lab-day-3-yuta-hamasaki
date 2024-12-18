"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = __importDefault(require("../controllers/chat.controller"));
const room_controller_1 = require("../controllers/room.controller");
const chatRouter = express_1.default.Router();
// Get all chat messages
chatRouter.get('/', chat_controller_1.default.getAllChats);
chatRouter.get('/room/:room', room_controller_1.getMessagesByRoom);
exports.default = chatRouter;
