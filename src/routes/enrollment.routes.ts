import { Router } from "express";
import {
  createEnrollmentHandler,
  pgWebhooksHandler,
  subscribeToCourseHandler,
  pgSubscriptionWebhooksHandler,
  cancelSubscriptionHandler,
  getUserEnrolledCourses,
  getAllCoursesWithEnrollments,
  getUserPayments,
  getAllPayments,
} from "../controllers/enrollment.controller";
import { authenticate } from "../middlewares/auth.middlewares";
import { authorize } from "../middlewares/authorize";

const router = Router();
//user apis
router.post("/", authenticate, createEnrollmentHandler);
router.post("/subscribe", authenticate, subscribeToCourseHandler);
router.post("/subscription/cancel", authenticate, cancelSubscriptionHandler);
router.get("/courses/user/:userId", authenticate, getUserEnrolledCourses);
router.get("/payments/user/:userId", authenticate, getUserPayments);

//webhooks
router.post("/webhooks", pgWebhooksHandler);
router.post("/webhooks/subscription", pgSubscriptionWebhooksHandler);

//admin apis
router.get("/payments/all", authenticate, authorize(["admin"]), getAllPayments);
router.get(
  "/courses-with-enrollments",
  authenticate,
  authorize(["admin"]),
  getAllCoursesWithEnrollments
);

export default router;
