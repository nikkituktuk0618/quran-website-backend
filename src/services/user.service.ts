import User from "../models/User";
import { Op } from "sequelize";

export const getAllUsersService = async () => {
  return await User.findAll({
    where: {
      role: "student",
    },
  });
};

export const createUserService = async (userData: any) => {
  return await User.create(userData);
};

export const updateProfile = async (
  userId: number,
  name?: string,
  email?: string,
  phone?: string
) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  // Check if email or phone already exists
  if (email) {
    const existingEmail = await User.findOne({
      where: { email, id: { [Op.ne]: userId } },
    });
    if (existingEmail) throw new Error("Email already in use");
  }

  if (phone) {
    const existingPhone = await User.findOne({
      where: { phone, id: { [Op.ne]: userId } },
    });
    if (existingPhone) throw new Error("Phone number already in use");
  }

  await user.update({ name, email, phone });

  return { message: "Profile updated successfully", user };
};
