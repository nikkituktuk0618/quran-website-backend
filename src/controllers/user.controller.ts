import { Request, Response } from "express";
import {
  getAllUsersService,
  createUserService,
  updateProfile,
} from "../services/user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const updateProfileController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    console.log(userId); // Assuming user ID is extracted from auth middleware
    const { name, email, phone } = req.body;
    const response = await updateProfile(userId, name, email, phone);
    res.json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
