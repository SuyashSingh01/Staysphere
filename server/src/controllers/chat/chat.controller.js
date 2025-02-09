import Chat from "../../models/Chat.model.js";

// currently we are not using the  this controller as we are
// directly using the socket service to listen and send the events  to
class ChatServiceController {
  /**
   * Join a chat room
   */
  async addUserToRoom(userId, roomId, next) {
    try {
      if (!userId || !roomId) {
        return next(new Error("User ID and Room ID are required"));
      }
      // Assume `authenticate` middleware attaches `user` to `req`
      if (!roomId) {
        return res
          .status(400)
          .json({ success: false, message: "Room ID is required." });
      }

      //  logic to add to  user to room

      res
        .status(200)
        .json({ success: true, message: "Joined room successfully." });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Save a message in the database
   */
  async saveMessage(userId, roomId, message) {
    let chat = await Chat.findOne({ roomId });
    if (!chat) {
      chat = new Chat({ roomId, messages: [] });
    }
    chat.messages.push({ sender: userId, message });
    await chat.save();
    return chat;
  }

  /**
   * Retrieve messages for a roomId
   */
  async getMessagesByRoomId(roomId, next) {
    try {
      if (!roomId) {
        return res
          .status(400)
          .json({ success: false, message: "Room ID is required." });
      }
      return await Chat.find({ roomId }).sort({ timestamp: 1 }); // Sort by timestamp (oldest to newest)
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatServiceController();
