import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect to the backend socket server
const socket = io('http://localhost:3001', {
  withCredentials: false,
  transports: ['websocket', 'polling'],
  forceNew: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

const ChatApp: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<{ username: string, message: string }[]>([]);

  useEffect(() => {
    // Handle connection
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    // Listen for incoming chat messages
    socket.on('chat', (data: { username: string, message: string }) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error', error);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('connect');
      socket.off('chat');
      socket.off('connect_error');
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && message.trim()) {
      socket.emit('chat', { username, message });
      setMessage('');
    }
  };

  return (
    <div className="container">
      <h1>Chat Application</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={username.trim() !== ''}
        />

        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!username.trim()}
        />

        <button type="submit">Send</button>
      </form>

      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatApp;
