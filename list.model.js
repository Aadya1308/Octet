import express from "express";
import { addTolist, getlistelements, removeAllFromlist } from "../controllers/list.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getlistelements);
router.post("/", protectRoute, addTolist);
router.delete("/", protectRoute, removeAllFromlist);

export default router;