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

export const createEnrollment = async (
  user_id: number,
  course_id: number,
  auto_renewal: boolean
) => {
  const course = await Course.findByPk(course_id);
  if (!course) throw new Error("Course not found");

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

  const order = await razorpay.orders.create({
    amount: Number(course.fee_amount) * 100, // Razorpay works in paise
    currency: "INR",
  });

  if (!enrollment) {
    // Create Enrollment Entry
    const enrollment1 = await Enrollment.create({
      user_id,
      course_id,
      pg_order_id: order.id,
      enrollment_type: "inactive",
      payment_status: "pending",
      auto_renewal,
    });
    return {
      pg_order_id: order.id,
      enrollment_id: enrollment1.id,
      amount: course.fee_amount,
    };
  } else {
    const rowAffected = await Enrollment.update(
      { pg_order_id: order.id },
      {
        where: {
          id: enrollment.id,
        },
      }
    );
    if (rowAffected.length < 1) {
      throw new Error("Could not update enrollment table");
    }
    return {
      pg_order_id: order.id,
      enrollment_id: enrollment.id,
      amount: course.fee_amount,
    };
  }
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
  } catch (error:any) {
    throw new Error(error.message);
  }

  return "Enrollment activated";
};
