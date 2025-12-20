import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { body } from "express-validator";

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

router.post("/logout", userAuth, userController.logout);

module.exports = router;
