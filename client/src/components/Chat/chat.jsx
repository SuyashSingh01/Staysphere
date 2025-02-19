import React, { useEffect, useMemo, useRef, useState, memo } from "react";
import { io } from "socket.io-client";
import { Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import "tailwindcss/tailwind.css";

const Chat = ({ userId, hostId }) => {
  const socket = useMemo(
    () =>
      io("http://localhost:4001/", {
        withCredentials: true,
      }),
    []
  );

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const roomId = [userId, hostId].sort().join("-"); // Unique room for the host and user

  // Fetch chat history and set up socket listeners
  useEffect(() => {
    // Join the room when the component mounts
    socket.emit("join_room", { roomId });

    // socket.on("connect", () => {
    //   console.log("Connected to server with ID:", socket.id);
    // });

    // Listen for chat history
    socket.on("chat_history", (history) => {
      console.log("Chat history received:", history);
      setMessages(history); // Set the chat history
    });

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup when component unmounts
    return () => {
      socket.emit("leave_room", { roomId });
      socket.off("chat_history");
      socket.off("receive_message");
    };
  }, [roomId, socket]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    // Emit the message to the server
    socket.emit("send_message", {
      roomId,
      message,
      sender: `User-${userId}`,
    });

    // Add the message locally
    setMessages((prev) => [
      ...prev,
      { sender: `User-${userId}`, message, timestamp: new Date() },
    ]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100  ">
      {/* Message Display Area */}

      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === `User-${userId}` ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`p-3 rounded-lg max-w-sm ${
                msg.sender === `User-${userId}`
                  ? "bg-blue-300 text-purple-900"
                  : "bg-gray-300 text-black"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs text-gray-800 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="flex items-center px-4 py-3 bg-white border-t">
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mr-3 flex-1"
          onPressEnter={sendMessage}
        />
        <Button type="primary" icon={<SendOutlined />} onClick={sendMessage} />
      </div>
    </div>
  );
};

export default memo(Chat);
