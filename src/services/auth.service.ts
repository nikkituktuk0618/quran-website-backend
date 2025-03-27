import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { JWT_SECRET_KEY, Reset_password_FE_link } from "../config/constants";
import { sendEmail } from "../services/email.service";

export const signup = async (
  name: string,
  email: string,
  password: string,
  role: "admin" | "student",
  phone: string
) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    phone,
  });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET_KEY, {
    expiresIn: "24h",
  });

  return { user, token };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );

  return { user, token };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  console.log(user);
  if (!user) throw new Error("User not found");

  const resetToken = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  console.log(resetToken);

  const resetLink = `${Reset_password_FE_link}${resetToken}`;

  await sendEmail(
    user.email,
    "Password Reset",
    `Click here to reset: ${resetLink}`
  );

  return { message: "Password reset link sent to your email" };
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET_KEY);
    const user = await User.findByPk(decoded.id);
    if (!user) throw new Error("Invalid or expired token");

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: "Password successfully reset" };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
