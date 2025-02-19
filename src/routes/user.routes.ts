import { Router } from "express";
import { getAllUsers, createUser } from "../controllers/user.controller";
import { authenticate } from '../middlewares/auth.middlewares';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.get("/", authenticate, authorize(["admin"]), getAllUsers);
router.post("/",authenticate, createUser);

export default router;
