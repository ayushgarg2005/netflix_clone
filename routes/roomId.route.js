import { addRoomId,deleteRoomId,searchRoomId,getRoomMessages } from "../controllers/roomId.controller.js";
import express from "express";

const router = express.Router();


router.post("/add", addRoomId);
router.delete("/delete/:roomId", deleteRoomId);
router.get("/search/:roomId", searchRoomId);
router.get("/messages/:roomId", getRoomMessages);


export default router;