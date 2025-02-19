// src/routes/video.routes.ts
import { Router } from "express";
import {
  createVideo,
  updateVideo,
  deleteVideo,
  getVideosByPlaylist,
} from "../controllers/video.controller";
import { authenticate } from "../middlewares/auth.middlewares";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.post("/", authenticate, authorize(["admin"]), createVideo);
router.put("/:id", authenticate, authorize(["admin"]), updateVideo);
router.delete("/:id", authenticate, authorize(["admin"]), deleteVideo);
router.get("/playlist/:playlist_id", authenticate, getVideosByPlaylist);

export default router;
