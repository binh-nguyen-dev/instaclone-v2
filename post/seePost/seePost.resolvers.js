import client from "../../client";
import ValidationError from "../../helpers/ValidationError";

export default {
  Query: {
    seePost: async (_, { postId }) => {
      const post = await client.post.findUnique({
        where: { id: postId },
<<<<<<< HEAD
=======
        include: {
          user: {
            include: {
              avatar: true,
            },
          },
          hashtags: true,
          photos: true,
        },
>>>>>>> 7892b9f... handle READ operation for Post model
      });

      if (!post) {
        throw new ValidationError("Post not found", 404);
      }

      return post;
    },
  },
};
