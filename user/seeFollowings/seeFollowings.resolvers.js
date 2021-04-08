import client from "../../client";
import ValidationError from "../../helpers/ValidationError";

export default {
  Query: {
    seeFollowings: async (_, { username, cursor, take = 20 }) => {
      const followings = await client.user
        .findUnique({
          where: { username },
        })
        .followings({
          ...(cursor && { cursor: { id: cursor } }),
          skip: cursor ? 1 : 0,
          take,
        });

      if (!followings) {
        throw new ValidationError("User not found", 404);
      }

      return followings;
    },
  },
};
