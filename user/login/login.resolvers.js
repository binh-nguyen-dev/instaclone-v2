import bcrypt from "bcrypt";
import client from "../../client";
import ValidationError from "../../helpers/ValidationError";
import { signToken } from "../user.utils";

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      const user = await getUser(username);
      await checkPasswordValid(password, user.password);

      const token = await signToken(user);
      return { ok: true, token };
    },
  },
};

async function getUser(username) {
  const user = await client.user.findUnique({ where: { username } });

  if (!user) {
    throw new ValidationError("The username/password is not valid", 401);
  }

  return user;
}

async function checkPasswordValid(password, hashedPassword) {
  const isValid = await bcrypt.compare(password, hashedPassword);

  if (!isValid) {
    throw new ValidationError("The username/password is not valid", 401);
  }
}
