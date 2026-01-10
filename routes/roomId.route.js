import { addRoomId,deleteRoomId,searchRoomId,getRoomMessages,getParticipants } from "../controllers/roomId.controller.js";
import express from "express";

const router = express.Router();

// ROOM ID MANAGEMENT
router.post("/add", addRoomId);
router.delete("/delete/:roomId", deleteRoomId);
router.get("/search/:roomId", searchRoomId);
router.get("/messages/:roomId", getRoomMessages);

// PARTICIPANTS
router.get("/participants/:roomId", getParticipants);

export default router;