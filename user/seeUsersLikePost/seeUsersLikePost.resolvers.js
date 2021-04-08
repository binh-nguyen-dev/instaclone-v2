import client from "../../client";
import ValidationError from "../../helpers/ValidationError";

export default {
  Query: {
    seeUsersLikePost: async (_, { postId, cursor, take = 20 }) => {
      await checkPostExist(postId);

      const usersLikePost = await client.user.findMany({
        where: {
          postsLiked: { some: { postId } },
        },
        ...(cursor && { cursor: { id: cursor } }),
        skip: cursor ? 1 : 0,
        take,
      });

      return usersLikePost;
    },
  },
};

async function checkPostExist(postId) {
  const post = await client.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new ValidationError("Post not found", 404);
  }
}
