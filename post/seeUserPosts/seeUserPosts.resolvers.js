import client from "../../client";
import ValidationError from "../../helpers/ValidationError";

export default {
  Query: {
    seeUserPosts: async (_, { username, cursor, take = 12 }) => {
      const posts = await client.user
        .findUnique({
          where: { username },
        })
        .posts({
          ...(cursor && { cursor: { id: cursor } }),
          skip: cursor ? 1 : 0,
          take,
        });

      if (!posts) {
        throw new ValidationError("User not found", 404);
      }

      return posts;
    },
  },
};
