import bcrypt from "bcrypt";
import client from "../../client";
import ValidationError from "../../helpers/ValidationError";
import runValidation from "../../validations";
import { editPasswordSchema } from "../../validations/user.validations";
import {
  generateComposedResolver,
  hashPassword,
  signToken,
} from "../user.utils";

export default generateComposedResolver({
  Mutation: {
    editPassword: async (
      _,
      { currentPassword, newPassword },
      { loggedInUser }
    ) => {
      await runValidation(editPasswordSchema, { newPassword });
      await checkPasswordCorrect(currentPassword, loggedInUser.password);

      const newHashedPassword = await hashPassword(newPassword);

      const updatedUser = await client.user.update({
        where: { id: loggedInUser.id },
        data: {
          password: newHashedPassword,
          passwordChangedAt: new Date(Date.now() - 1000),
        },
      });

      const token = await signToken(updatedUser);

      return { ok: true, token };
    },
  },
});

async function checkPasswordCorrect(plainPassword, hashedPassword) {
  const isCorrect = await bcrypt.compare(plainPassword, hashedPassword);

  if (!isCorrect) {
    throw new ValidationError(`"currentPassword" is incorrect`);
  }
}
