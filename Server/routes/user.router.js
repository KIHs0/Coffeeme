import express from "express";
import { IsAuthenticated } from "../middleware/isAuthenticate.js";
export const router = express.Router();
import {
  register,
  login,
  home,
  getProfile,
  logout,
  getOtherUser,
} from "../controller/user.controller.js";

router.get("/", home);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getprofile", IsAuthenticated, getProfile);
router.get("/getUser", IsAuthenticated, getOtherUser);
