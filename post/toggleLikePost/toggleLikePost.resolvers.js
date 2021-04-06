import client from "../../client";
import ValidationError from "../../helpers/ValidationError";
import { generateComposedResolver } from "../../user/user.utils";

export default generateComposedResolver({
  Mutation: {
    toggleLikePost: async (_, { postId }, { loggedInUser }) => {
      await checkPostExist(postId);

      const meLikePost = await checkMeLikePost({
        userId: loggedInUser.id,
        postId,
      });

      if (meLikePost) {
        await client.likePost.delete({
          where: {
            userId_postId: { userId: loggedInUser.id, postId },
          },
        });
      } else {
        await client.likePost.create({
          data: {
            user: {
              connect: { id: loggedInUser.id },
            },
            post: {
              connect: { id: postId },
            },
          },
        });
      }

      return { ok: true };
    },
  },
});

async function checkPostExist(postId) {
  const post = await client.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new ValidationError("Post not found", 404);
  }
}

async function checkMeLikePost({ userId, postId }) {
  const meLikePost = await client.likePost.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  return Boolean(meLikePost);
}
