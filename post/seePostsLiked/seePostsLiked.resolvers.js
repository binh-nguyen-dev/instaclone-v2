import client from "../../client";
import ValidationError from "../../helpers/ValidationError";

export default {
  Query: {
    seePostsLiked: async (_, { username, cursor, take = 12 }) => {
      const postsLiked = await client.user
        .findUnique({
          where: { username },
        })
        .postsLiked({
          ...(cursor && { cursor: { id: cursor } }),
          skip: cursor ? 1 : 0,
          take,
        });

      if (!postsLiked) {
        throw new ValidationError("User not found", 404);
      }

      return postsLiked;
    },
  },
};
