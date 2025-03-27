import { Request, Response } from "express";
import { signup, login } from "../services/auth.service";
import { forgotPassword, resetPassword } from "../services/auth.service";

export const signupController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, email, password, role, phone } = req.body;
    const response = await signup(name, email, password, role, phone);
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, password } = req.body;
    const response = await login(email, password);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const response = await forgotPassword(email);
    res.json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const response = await resetPassword(token, newPassword);
    res.json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
