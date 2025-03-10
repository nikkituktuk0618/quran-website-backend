import { Request, Response } from "express";
import {
  createEnrollment,
  handlePaymentSuccess,
  getUserEnrolledCoursesService,
  getAllCoursesWithEnrollmentsService,
  getAllPaymentsService,
  getUserPaymentsService,
} from "../services/enrollment.service";
import {
  createSubscriptionToACourse,
  handleSubscriptionCharged,
  handleSubscriptionActivated,
  handleSubscriptionCancelled,
  cancelSubscription,
  handleSubscriptionPending,
  handleSubscriptionExpired,
  handleSubscriptionCompleted,
  handleSubscriptionHalted,
} from "../services/subscription.service";

export const createEnrollmentHandler = async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.body;
    console.log(userId, courseId);
    const Enrollment = await createEnrollment(userId, courseId);
    res.json(Enrollment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const pgWebhooksHandler = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    console.log(JSON.stringify(req.body.payload.payment.entity));

    const order = req.body.payload.payment.entity;
    const payment_status = order.status;
    const pg_transaction_id = order.id;
    const pg_order_id = order.order_id;
    const amount = order.amount;
    await handlePaymentSuccess(
      pg_transaction_id,
      pg_order_id,
      payment_status,
      amount
    );
    res.json("ok");
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const subscribeToCourseHandler = async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.body;
    console.log(userId, courseId);
    const Enrollment = await createSubscriptionToACourse(userId, courseId);
    res.json(Enrollment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelSubscriptionHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, courseId } = req.body;
    console.log(userId, courseId);
    const Enrollment = await cancelSubscription(userId, courseId);
    res.json(Enrollment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const pgSubscriptionWebhooksHandler = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("subscribtion webhook");
    console.log(req.body);
    const { event, payload } = req.body;
    const { subscription, payment } = payload;
    switch (event) {
      case "subscription.activated":
        console.log(" Subscription activated:", payload.subscription.entity);
        await handleSubscriptionActivated(subscription.entity.id);
        break;
      case "subscription.charged":
        console.log(" Subscription charged:", payload.subscription.entity);
        await handleSubscriptionCharged(
          subscription.entity.id,
          payment.entity.id,
          payment.entity.amount,
          subscription.entity.charge_at,
          subscription.entity.remaining_count
        );
        break;

      case "subscription.cancelled":
        console.log(" Subscription cancelled:", payload.subscription.entity);
        await handleSubscriptionCancelled(subscription.entity.id);
        break;

      case "subscription.pending":
        console.log(
          "⚠️ Subscription payment pending:",
          payload.subscription.entity
        );
        await handleSubscriptionPending(subscription.entity.id);
        break;

      case "subscription.halted":
        console.log(
          "❌ Subscription halted (all retries failed):",
          payload.subscription.entity
        );
        await handleSubscriptionHalted(subscription.entity.id);
        break;

      case "subscription.expired":
        console.log("⌛ Subscription expired:", payload.subscription.entity);
        await handleSubscriptionExpired(subscription.entity.id);
        break;

      case "subscription.completed":
        console.log("✅ Subscription completed:", payload.subscription.entity);
        await handleSubscriptionCompleted(subscription.entity.id);
        break;

      default:
        console.log("Unhandled subscription event:", event);
    }
    res.json("ok");
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserEnrolledCourses = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const enrolledCourses = await getUserEnrolledCoursesService(userId);

    if (!enrolledCourses.length) {
      return res
        .status(404)
        .json({ message: "User is not enrolled in any courses" });
    }

    return res.json({ userId, enrolledCourses });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllCoursesWithEnrollments = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const coursesWithEnrollments = await getAllCoursesWithEnrollmentsService();

    if (!coursesWithEnrollments.length) {
      return res
        .status(404)
        .json({ message: "No courses found with enrollments" });
    }

    return res.json({ courses: coursesWithEnrollments });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getUserPayments = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = parseInt(req.params.userId);
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const payments = await getUserPaymentsService(userId);
    if (!payments.length)
      return res
        .status(404)
        .json({ message: "No payments found for this user" });

    return res.json({ payments });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllPayments = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const payments = await getAllPaymentsService();
    if (!payments.length)
      return res.status(404).json({ message: "No payments found" });

    return res.json({ payments });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
