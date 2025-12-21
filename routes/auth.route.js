import express from "express";
import { body } from "express-validator";

import {
  sendSignupOtp,
  verifySignupOtp,
  loginUser,
  logout
} from "../controllers/auth.controller.js";

import userAuth from "../middleware/auth.middleware.js";

const router = express.Router();

/* ================= SIGNUP STEP 1 – SEND OTP ================= */
router.post(
  "/signup/send-otp",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("name")
      .isLength({ min: 5 })
      .withMessage("Username must be at least 5 characters long")
      .isLength({ max: 20 })
      .withMessage("Username must be at max 20 characters long"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),
  ],
  sendSignupOtp
);

/* ================= SIGNUP STEP 2 – VERIFY OTP ================= */
router.post(
  "/signup/verify-otp",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
    body("name").notEmpty(),
    body("password").notEmpty(),
  ],
  verifySignupOtp
);

/* ================= LOGIN ================= */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),
  ],
  loginUser
);

/* ================= LOGOUT ================= */
router.post("/logout", userAuth, logout);

export default router;
