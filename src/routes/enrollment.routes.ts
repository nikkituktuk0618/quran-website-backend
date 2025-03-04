import { Router } from "express";
import {
  createEnrollmentHandler,
  pgWebhooksHandler,
  subscribeToCourseHandler,
  pgSubscriptionWebhooksHandler,
  cancelSubscriptionHandler,
} from "../controllers/enrollment.controller";
import { authenticate } from "../middlewares/auth.middlewares";

const router = Router();

router.post("/", authenticate, createEnrollmentHandler);
router.post("/webhooks", pgWebhooksHandler);
router.post("/subscribe", subscribeToCourseHandler);
router.post("/webhooks/subscription", pgSubscriptionWebhooksHandler);
router.post("/subscription/cancel", cancelSubscriptionHandler);

export default router;
