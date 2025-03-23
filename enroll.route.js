import express from "express";
import { needRoute } from "../middleware/auth.middleware.js";
import { enrollSuccess, createenrollSession } from "../controllers/enroll.controller.js";

const router = express.Router();

router.post("/create-enrollment-session", protectRoute, createenrollSession);
router.post("/enrollment-success", protectRoute, enrollSuccess);

export default router;