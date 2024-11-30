import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
  withCredentials: false,
  transports: ['websocket', 'polling'],
  forceNew: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

const ChatApp = () => {
  const [username, setUsername] = useState<string>('');
  const [isUsernameSet, setIsUsernameSet] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<{ username: string, message: string }[]>([]);
  const [room, setRoom] = useState<string>('general');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('chat', (data: { username: string, message: string }) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('chatHistory', (data) => {
      setMessages(data);
    });

    return () => {
      socket.off('connect');
      socket.off('chat');
    };
  }, []);

  const handleJoinRoom = (roomName: string) => {
    setRoom(roomName);
    setMessages([]);
    socket.emit('leaveRoom', room);
    socket.emit('joinRoom', roomName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUsernameSet && message.trim()) {
      socket.emit('chat', { username, message, room });
      setMessage('');
    }
  };

  const handleSetUsername = () => {
    if (username.trim().length > 0) {
      setIsUsernameSet(true);
    }
  };

  return (
    <div>
      <div className="w-full flex justify-center flex-col px-10">

        <div className=" pt-10 flex justify-center space-x-2">
          <button
            className={`px-4 py-2 rounded-t-lg font-medium ${
              room === 'yuta' ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleJoinRoom('yuta')}
          >
            Room Yuta
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-medium ${
              room === 'amigos' ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleJoinRoom('amigos')}
          >
            Amigos
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-medium ${
              room === 'cornerstone' ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleJoinRoom('cornerstone')}
          >
            Cornerstone
          </button>
        </div>

        <div className="h-60 overflow-y-auto bg-gray-100 rounded-lg p-4 mb-4">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`mb-2 flex ${
        msg.username === username ? 'justify-end' : 'justify-start'
      }`}
    >
      {msg.username === username ? (
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs">
          <span className="font-semibold">You: </span>
          <span>{msg.message}</span>
        </div>
      ) : (
        <div className="bg-gray-200 px-4 py-2 rounded-lg max-w-xs">
          <strong className="text-black">{msg.username}: </strong>
          <span>{msg.message}</span>
        </div>
      )}
    </div>
  ))}
</div>


      <form onSubmit={handleSubmit} className="space-y-4">

        {!isUsernameSet ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleSetUsername}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
            >
              Set Username
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500 mb-4">
            <strong>{username}</strong>
          </p>
        )}

          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!username.trim()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-200"
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Send
          </button>
      </form>
      </div>
    </div>
  );
};

export default ChatApp;
