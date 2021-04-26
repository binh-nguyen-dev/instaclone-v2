import { composeResolvers } from "@graphql-tools/resolvers-composition";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../client";
import ValidationError from "../helpers/ValidationError";

export const hashPassword = async (plainPassword) => {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  return hashedPassword;
};

export const signToken = async (user) => {
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
  return token;
};

export const getUser = async (token) => {
  if (!token) return null;

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await client.user.findFirst({
      where: {
        id: decoded.id,
        OR: [
          { passwordChangedAt: null },
          { passwordChangedAt: { lt: new Date(decoded.iat * 1000) } },
        ],
      },
    });

    if (!user) return null;

    return user;
  } catch (error) {
    return null;
  }
};

const protect = () => (next) => (parent, args, context, info) => {
  if (!context.loggedInUser?.id) {
    throw new ValidationError("Please login to perform this action.", 401);
  }

  return next(parent, args, context, info);
};

export const generateComposedResolver = (resolver) => {
  const resolversComposition = {
    "Mutation.createPost": [protect()],
    "Mutation.createComment": [protect()],
    "Mutation.toggleLikePost": [protect()],
    "Mutation.toggleLikeComment": [protect()],
    "Mutation.editProfile": [protect()],
    "Mutation.editPassword": [protect()],
    "Mutation.editAvatar": [protect()],
  };

  return composeResolvers(resolver, resolversComposition);
};
