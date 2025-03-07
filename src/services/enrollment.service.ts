import Razorpay from "razorpay";
import Enrollment from "../models/Enrollment";
import Payment from "../models/Payment";
import Course from "../models/Course";
import { razorpay_token_id, RAZORPAY_KEY_SECRET } from "../config/constants";
import { User } from "../models";

const razorpay = new Razorpay({
  key_id: razorpay_token_id,
  key_secret: RAZORPAY_KEY_SECRET,
});

export const createEnrollment = async (user_id: number, course_id: number) => {
  const course = await Course.findByPk(course_id);
  if (!course) throw new Error("Course not found");
  if (course && course.fee_type !== "one-time") {
    throw new Error("Invalid action. cannot create enrollment");
  }

  const user = await User.findByPk(user_id);
  if (!user) throw new Error("User not found");

  const enrollment = await Enrollment.findOne({
    where: { course_id: course_id, user_id: user_id },
  });
  if (
    enrollment &&
    enrollment.enrollment_type === "active" &&
    enrollment.payment_status === "success"
  ) {
    throw new Error("Already active enrollment");
  }
  if (enrollment) {
    const order = await razorpay.orders.fetch(enrollment.pg_order_id as string);
    if (order.status === "paid") {
      throw new Error(
        "Already made payment. please refresh to see your enrollment"
      );
    } else if (order.status === "attempted" || order.status === "created") {
      return {
        pg_order_id: order.id,
        enrollment_id: enrollment.id,
        amount: course.fee_amount,
      };
    } else {
      throw new Error("unknown payment status" + order.id);
    }
  }

  const order = await razorpay.orders.create({
    amount: Number(course.fee_amount) * 100, // Razorpay works in paise
    currency: "INR",
  });

  // Create Enrollment Entry
  const enrollment1 = await Enrollment.create({
    user_id,
    course_id,
    pg_order_id: order.id,
    enrollment_type: "inactive",
    payment_status: "pending",
    razorpay_status: "created",
  });
  return {
    pg_order_id: order.id,
    enrollment_id: enrollment1.id,
    amount: course.fee_amount,
  };
};

export const handlePaymentSuccess = async (
  pg_transaction_id: string,
  pg_order_id: string,
  payment_status: string,
  amount: number
) => {
  try {
    console.log("service hit");
    console.log(pg_transaction_id, pg_order_id, payment_status, amount);
    const enrollment = await Enrollment.findOne({
      where: { pg_order_id: pg_order_id },
    });
    console.log(enrollment);
    if (!enrollment) throw new Error("Enrollment not found");

    if (payment_status === "payment.captured") {
      enrollment.enrollment_type = "active";
      enrollment.payment_status = "success";
    } else if (payment_status === "payment.failed") {
      enrollment.enrollment_type = "inactive";
      enrollment.payment_status = "failed";
    }
    await enrollment.save();
    console.log("Enrollment saved");
    // Store Payment Record

    const payment = await Payment.create({
      enrollment_id: enrollment.id,
      pg_order_id,
      pg_transaction_id,
      payment_amount: amount / 100,
      payment_status:
        payment_status === "payment.captured" ? "success" : "failed",
      payment_date: new Date(),
    });
  } catch (error: any) {
    throw new Error(error.message);
  }

  return "Enrollment activated";
};
