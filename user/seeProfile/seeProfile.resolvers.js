import client from "../../client";
import ValidationError from "../../helpers/ValidationError";

export default {
  Query: {
    seeProfile: async (_, { username }) => {
      const user = await client.user.findUnique({
        where: { username },
      });

      if (!user) {
        throw new ValidationError("User not found", 404);
      }

      return user;
    },
  },
};
