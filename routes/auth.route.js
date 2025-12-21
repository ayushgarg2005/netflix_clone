import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser, logout } from "../controllers/auth.controller.js";
import userAuth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("username")
      .isLength({ min: 5 })
      .withMessage("Username must be atleast 5 characters long"),
    body("username")
      .isLength({ max: 20 })
      .withMessage("Username must be atMax 20 characters long"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be atleast 5 characters long"),
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("username")
      .isLength({ min: 5 })
      .withMessage("Username must be atleast 5 characters long"),
    body("username")
      .isLength({ max: 20 })
      .withMessage("Username must be atMax 20 characters long"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be atleast 5 characters long"),
  ],
  loginUser
);

router.post("/logout", userAuth, logout);

export default router;