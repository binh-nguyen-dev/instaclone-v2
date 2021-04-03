import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = async (plainPassword) => {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  return hashedPassword;
};

export const signToken = async (user) => {
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
  return token;
};
