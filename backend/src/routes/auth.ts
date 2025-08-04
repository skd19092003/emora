import { Router } from "express";
import { register, login, logout } from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = Router();
//this created a instance of Router which is a mini express application that can handle routes

// POST /auth/register
//these are post endpoints that will handle the requests
//when a register request is made to /auth/register, the register function will be called
//first it will pass through the auth middleware to check if the user is authenticated
//if the user is authenticated, it will call the register function
//this is a route handler that will handle the request and response
router.post("/register", register);

// POST /auth/login
router.post("/login", login);

// POST /auth/logout
router.post("/logout", auth, logout);

// GET /auth/me
// This endpoint returns the authenticated user's information
// It uses the auth middleware to ensure the user is authenticated before accessing this route
router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

export default router;