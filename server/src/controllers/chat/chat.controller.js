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
      return await Chat.find({ roomId }).sort({ timestamp: 1 });
    } catch (error) {
      next(error);
    }
  }
  async getUsersMessageByHostId(req, res, next) {
    try {
      const { hostId } = req.params;
      const chats = await Chat.find({ hostId }).populate(
        "userId",
        "name email"
      );
      res.json(chats);
    } catch (error) {
      console.error("Error fetching host chats:", error);
      res.status(500).json({ message: "Error fetching chats" });
    }
  }
}

export default new ChatServiceController();
