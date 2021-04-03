import client from "../../client";
import ValidationError from "../../helpers/ValidationError";
import runValidation from "../../validations";
import { createAccountSchema } from "../../validations/user.validations";
import { signToken, hashPassword } from "../user.utils";

export default {
  Mutation: {
    createAccount: async (_, args) => {
      await runValidation(createAccountSchema, args);
      await checkUserExist({ username: args.username, email: args.email });

      const processedData = await processData(args);

      const newUser = await client.user.create({
        data: processedData,
      });

      const token = signToken(newUser);
      return { ok: true, token };
    },
  },
};

async function processData({ password, ...rest }) {
  const hasedPassword = await hashPassword(password);

  return { ...rest, password: hasedPassword };
}

async function checkUserExist({ username, email }) {
  const user = await client.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });
  if (user) {
    throw new ValidationError("The username/email have already taken");
  }
}
