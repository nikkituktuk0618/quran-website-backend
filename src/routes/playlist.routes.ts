// src/routes/playlist.routes.ts
import { Router } from "express";
import {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getPlaylistsByCourse,
} from "../controllers/playlist.controller";
import { authenticate } from "../middlewares/auth.middlewares";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.post("/", authenticate, authorize(["admin"]), createPlaylist);
router.put("/:id", authenticate, authorize(["admin"]), updatePlaylist);
router.delete("/:id", authenticate, authorize(["admin"]), deletePlaylist);
router.get("/course/:course_id", authenticate, getPlaylistsByCourse);

export default router;
