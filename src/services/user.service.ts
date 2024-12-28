import { User } from "../models/User";

export const getAllUsersService = async () => {
  return await User.findAll();
};

export const createUserService = async (userData: any) => {
  return await User.create(userData);
};
