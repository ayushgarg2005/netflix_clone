// controllers/roomId.controller.js
import RoomId from "../models/RoomId.model.js";
import Message from "../models/message.model.js";

export const addRoomId = async (req, res) => {
  try {
    const { roomId, movieId, adminId } = req.body;
    const newRoom = new RoomId({ roomId, movieId, adminId });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    const deletedRoom = await RoomId.findOneAndDelete({ roomId });
    if (!deletedRoom) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};

export const searchRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await RoomId.findOne({ roomId });
    if (!room) return res.status(404).json({ found: false });
    res.json({ found: true, roomId: room.roomId, movieId: room.movieId, adminId: room.adminId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Fetch all messages for a specific room
export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET ALL PARTICIPANTS ================= */
export const getParticipants = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await RoomId.findOne({ roomId }).populate(
      "participants.userId",
      "name email"
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({
      count: room.participants.length,
      participants: room.participants,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};