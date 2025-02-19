import { Request, Response } from "express";
import {
  createEnrollment,
  handlePaymentSuccess,
} from "../services/enrollment.service";

export const createEnrollmentHandler = async (req: Request, res: Response) => {
  try {
    const { userId, courseId, autoRenewal } = req.body;
    console.log(userId, courseId, autoRenewal);
    const Enrollment = await createEnrollment(userId, courseId, autoRenewal);
    res.json(Enrollment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const pgWebhooksHandler = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    console.log(JSON.stringify(req.body.payload.payment.entity));
    const payment_status = req.body.event;
    const order = req.body.payload.payment.entity;
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
