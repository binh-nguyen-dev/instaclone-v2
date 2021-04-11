import client from "../../client";
import ValidationError from "../../helpers/ValidationError";

export default {
  Query: {
    seePost: async (_, { postId }) => {
      const post = await client.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new ValidationError("Post not found", 404);
      }

      return post;
    },
  },
};
