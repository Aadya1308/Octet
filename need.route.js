import express from "express";
import {
	createneed,
	deleteneed,
	getAllneeds,
	getFeaturedneeds,
	getneedByState,
	toggleFeaturedneeds,
} from "../controllers/need.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllneeds);
router.get("/featured", getFeaturedneeds);
router.get("/category/:category", getneedByState);
router.post("/", protectRoute, adminRoute, createneed);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedneeds);
router.delete("/:id", protectRoute, adminRoute, deleteneed);

export default router;