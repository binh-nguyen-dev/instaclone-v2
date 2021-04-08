import client from "../../client";
import ValidationError from "../../helpers/ValidationError";

export default {
  Query: {
    seeFollowers: async (_, { username, cursor, take = 20 }) => {
      const followers = await client.user
        .findUnique({
          where: { username },
        })
        .followers({
          ...(cursor && { cursor: { id: cursor } }),
          skip: cursor ? 1 : 0,
          take,
        });

      if (!followers) {
        throw new ValidationError("User not found", 404);
      }

      return followers;
    },
  },
};
