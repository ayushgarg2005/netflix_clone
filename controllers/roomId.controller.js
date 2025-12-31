import RoomId from "../models/RoomId.model.js";


export const addRoomId = async (req, res) => {
  try {
    const { roomId } = req.body;
    console.log("Adding Room ID:", roomId);
    const newRoom = new RoomId({ roomId });
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
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room ID not found" });
    }  
    res.json({ message: "Room ID deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};


export const searchRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    console.log("Searching for Room ID:", roomId);
    const room = await RoomId.findOne({ roomId });
    if (!room) {
      return res.status(404).json({
        found: false, 
        message: "Room ID not found" 
    });
    }   
    res.json({
        found: true,
        roomId: room.roomId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};