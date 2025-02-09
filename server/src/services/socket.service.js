import { Server } from "socket.io";
import Chat from "../models/Chat.model.js";

class SocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    console.log("constructor called");
    this.initializeSocket();
  }

  initializeSocket() {
    console.log("Socket.IO initialized");

    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Join specific user-host room
      socket.on("join_room", async ({ roomId }) => {
        if (!roomId) {
          console.error("Room ID is required to join a room.");
          return;
        }

        socket.join(roomId);

        console.log(`User with ID ${socket.id} joined room: ${room}`);

        try {
          const chat = await Chat.findOne({ roomId });
          const messages = chat ? chat.messages : [];
          socket.emit("chat_history", messages); // Send chat history to the client
        } catch (error) {
          console.error(
            `Error fetching chat history for room ${roomId}:`,
            error
          );
          socket.emit("error", { message: "Error fetching chat history" });
        }
      });

      // Handle sending and broadcasting messages
      socket.on("send_message", async (data) => {
        const { roomId, message, sender } = data;

        // Validate input
        if (!roomId || !sender || !message) {
          console.error("Invalid data received for send_message event:", data);
          return socket.emit("error", { message: "Invalid message data" });
        }

        try {
          // Find or create the chat room
          let chat = await Chat.findOne({ roomId });
          if (!chat) {
            chat = new Chat({ roomId, messages: [] });
          }

          // Push the new message
          chat.messages.push({ sender, message, timestamp: new Date() });
          await chat.save();

          // Emit the message to the room
          this.io.to(roomId).emit("receive_message", {
            message,
            sender,
            timestamp: new Date(),
          });
        } catch (error) {
          console.error("Error saving message:", error);
          socket.emit("error", { message: "Error saving message" });
        }
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }
}

export default SocketService;
