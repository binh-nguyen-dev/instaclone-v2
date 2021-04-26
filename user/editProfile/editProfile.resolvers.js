import client from "../../client";
import runValidation from "../../validations";
import { editProfileSchema } from "../../validations/user.validations";
import { generateComposedResolver } from "../user.utils";

export default generateComposedResolver({
  Mutation: {
    editProfile: async (_, args, { loggedInUser }) => {
      await runValidation(editProfileSchema, args);

      await client.user.update({
        where: {
          id: loggedInUser.id,
        },
        data: args,
      });

      return { ok: true };
    },
  },
});
