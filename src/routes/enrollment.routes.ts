import { Router } from "express";
import { createEnrollmentHandler, pgWebhooksHandler} from "../controllers/enrollment.controller";
import { authenticate } from "../middlewares/auth.middlewares";

const router = Router();

router.post("/", authenticate, createEnrollmentHandler);
router.post("/webhooks", pgWebhooksHandler);

export default router;
