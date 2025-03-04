import Razorpay from "razorpay";
import Enrollment from "../models/Enrollment";
import Course from "../models/Course";
import { razorpay_token_id, RAZORPAY_KEY_SECRET } from "../config/constants";
import { User } from "../models";
import Payment from "../models/Payment";

const razorpay = new Razorpay({
  key_id: razorpay_token_id,
  key_secret: RAZORPAY_KEY_SECRET,
});

export const createPGPlan = async (amount: number) => {
  try {
    const plan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "Monthly Course Subscription",
        amount: amount * 100,
        currency: "INR",
        description: "Access to Course X",
      },
    });

    console.log("Plan Created:", plan);
    return plan.id;
  } catch (error: any) {
    console.error("Error creating plan:", error);
    throw new Error(error);
  }
};

export const createSubscriptionToACourse = async (
  user_id: number,
  course_id: number
) => {
  try {
    const course = await Course.findByPk(course_id);
    if (!course || !course.plan_id)
      throw new Error("Invalid course or missing plan ID");

    const user = await User.findByPk(user_id);
    if (!user) throw new Error("User not found");

    const enrollment = await Enrollment.findOne({
      where: { course_id: course_id, user_id: user_id },
    });
    if (enrollment) {
      const subscription = await razorpay.subscriptions.fetch(
        enrollment.subscription_id as string
      );
      if (subscription.status === "expired") {
        const subscription = await razorpay.subscriptions.create({
          plan_id: course.plan_id,
          total_count: 12, // 12 months or unlimited (null)
          customer_notify: 1, // Start immediately
        });
        enrollment.subscription_id = subscription.id;
        enrollment.next_billing_date = subscription.current_end
          ? new Date(subscription.current_end * 1000)
          : null;
        enrollment.remaining_cycles = Number(subscription.remaining_count);
        await enrollment.save();
      }
      return {
        subscription_id: enrollment.subscription_id,
        enrollment_id: enrollment.id,
      };
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: course.plan_id,
      total_count: 12, // 12 months or unlimited (null)
      customer_notify: 1, // Start immediately
    });

    const enrollment1 = await Enrollment.create({
      user_id,
      course_id,
      subscription_id: subscription.id,
      enrollment_type: "inactive",
      razorpay_status: "created",
      payment_status: "pending",
      start_date: new Date(),
      next_billing_date: subscription.current_end
        ? new Date(subscription.current_end * 1000)
        : null,
      remaining_cycles: subscription.remaining_count,
      auto_renewal: true,
    });

    return { subscription_id: subscription.id, enrollment_id: enrollment1.id };
  } catch (error: any) {
    console.error("Subscription Error:", error);
    throw new Error(error);
  }
};

export const handleSubscriptionActivated = async (subscription_id: string) => {
  const enrollment = await Enrollment.findOne({ where: { subscription_id } });
  if (!enrollment) throw new Error("Enrollment not found");

  enrollment.enrollment_type = "active";
  enrollment.razorpay_status = "active";
  enrollment.payment_status = "success";
  enrollment.next_billing_date = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ); // Next month
  await enrollment.save();
};

export const handleSubscriptionCharged = async (
  subscription_id: string,
  payment_id: string,
  amount: number,
  charge_at: number,
  remaining_count: number
) => {
  const enrollment = await Enrollment.findOne({ where: { subscription_id } });
  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  await Payment.create({
    enrollment_id: enrollment.id,
    pg_order_id: subscription_id,
    pg_transaction_id: payment_id,
    payment_amount: amount / 100,
    payment_status: "success",
    payment_date: new Date(),
  });

  enrollment.next_billing_date = new Date(charge_at * 1000);
  enrollment.remaining_cycles = remaining_count;

  await enrollment.save();
};

export const handleSubscriptionCancelled = async (subscription_id: string) => {
  const enrollment = await Enrollment.findOne({ where: { subscription_id } });
  if (!enrollment) throw new Error("Enrollment not found");

  enrollment.enrollment_type = "expired";
  enrollment.razorpay_status = "cancelled";
  await enrollment.save();
};

export const cancelSubscription = async (
  user_id: number,
  course_id: number
) => {
  const enrollment = await Enrollment.findOne({
    where: { course_id: course_id, user_id: user_id },
  });
  if (!enrollment) {
    throw new Error("Subscription not found");
  }
  return await razorpay.subscriptions.cancel(
    enrollment.subscription_id as string,
    1
  );
};

export const handleSubscriptionPending = async (subscription_id: string) => {
  const enrollment = await Enrollment.findOne({ where: { subscription_id } });
  if (!enrollment)
    return console.error("Enrollment not found for:", subscription_id);

  enrollment.razorpay_status = "pending";
  enrollment.payment_status = "pending";

  await enrollment.save();
  console.log(`⚠️ Subscription ${subscription_id} is pending. Notify user.`);
};

export const handleSubscriptionHalted = async (subscription_id: string) => {
  const enrollment = await Enrollment.findOne({ where: { subscription_id } });
  if (!enrollment)
    return console.error("Enrollment not found for:", subscription_id);

  enrollment.razorpay_status = "halted";
  enrollment.enrollment_type = "inactive";
  await enrollment.save();
  console.log(
    `❌ Subscription ${subscription_id} halted. Disable course access.`
  );
};

export const handleSubscriptionExpired = async (subscription_id: string) => {
  const enrollment = await Enrollment.findOne({ where: { subscription_id } });
  if (!enrollment)
    return console.error("Enrollment not found for:", subscription_id);

  enrollment.payment_status = "pending";
  enrollment.enrollment_type = "inactive";
  enrollment.razorpay_status = "expired";
  await enrollment.save();
  console.log(
    `⌛ Subscription ${subscription_id} expired. User must re-subscribe.`
  );
};

export const handleSubscriptionCompleted = async (subscription_id: string) => {
  const enrollment = await Enrollment.findOne({ where: { subscription_id } });
  if (!enrollment)
    return console.error("Enrollment not found for:", subscription_id);

  enrollment.payment_status = "success";
  enrollment.enrollment_type = "active";
  enrollment.auto_renewal = false; // Stop auto-renewal
  await enrollment.save();
  console.log(
    `✅ Subscription ${subscription_id} completed. User retains access.`
  );
};
