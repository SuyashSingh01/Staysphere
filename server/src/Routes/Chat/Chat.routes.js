import express from "express";
import { controllers } from "../../controllers/index.controller.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

// Real-Time Chat  currently we are not using routes for real-time chat purposes but we can use it in the future
router.post("/joinRoom", auth, controllers.chatservice.addUserToRoom); // Join a chat room

router.post("/sendMessage", auth, controllers.chatservice.saveMessage); // Save a message

router.get(
  "/messages/:roomId",
  auth,
  controllers.chatservice.getMessagesByRoomId
);

// Get all users who messaged the host
router.get(
  "/host-chats/:hostId",
  controllers.chatservice.getUsersMessageByHostId
);

export default router;
