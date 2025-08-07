import express from "express";
import { changePassword, forgotPassword, getUser, getUserNoLogin, loginUser, logoutUser, registerUser, resetPassword, updateProfile } from "../controllers/userController";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.put("/update/me", isAuthenticated, updateProfile);

router.get("/logout", isAuthenticated ,logoutUser);

router.get("/details", isAuthenticated, getUser);

router.get("/details/me", getUserNoLogin);

router.put("/update/password", isAuthenticated, changePassword);

router.post("/forgot/password", forgotPassword);

router.put("/reset/password/:token", resetPassword);

export default router;
