import { Router } from "express";
import {
  getAllUsers,
  createUser,
  updateProfileController,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middlewares";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.get("/", authenticate, authorize(["admin"]), getAllUsers);
router.post("/", authenticate, authorize(["admin"]), createUser);
router.put("/profile", authenticate, updateProfileController);

export default router;
