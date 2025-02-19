import { Request, Response } from "express";
import { signup, login } from "../services/auth.service";

export const signupController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, email, password, role } = req.body;
    const response = await signup(name, email, password, role);
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
