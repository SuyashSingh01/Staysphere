import express from "express";
import { controllers } from "../../controllers/index.controller.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

// Real-Time Chat  not working properly
router.post("/joinRoom", auth, controllers.chatservice.addUserToRoom); // Join a chat room
// router.post("/sendMessage", auth, controllers.chat.sendmessage); // Send a message
router.get(
  "/messages/:roomId",
  auth,
  controllers.chatservice.getMessagesByRoomId
); // Get messages for a room

export default router;
