import { Router } from "express";
import userRoutes from "./user.routes";
import courseRoutes from "./course.routes";
import playlistRoutes from "./playlist.routes";
import videoRoutes from "./video.routes";
import authRoutes from "./auth.routes";
import enrollmentRoutes from "./enrollment.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/playlists", playlistRoutes);
router.use("/videos", videoRoutes);
router.use("/enrollment", enrollmentRoutes);

export default router;
