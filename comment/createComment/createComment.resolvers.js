import client from "../../client";
import ValidationError from "../../helpers/ValidationError";
import { generateComposedResolver } from "../../user/user.utils";
import runValidation from "../../validations";
import { createCommentSchema } from "../../validations/comment.validations";

export default generateComposedResolver({
  Mutation: {
    createComment: async (_, { content, postId }, { loggedInUser }) => {
      await runValidation(createCommentSchema, { content });
      await checkPostExist(postId);

      await client.comment.create({
        data: {
          content,
          user: {
            connect: { id: loggedInUser.id },
          },
          post: {
            connect: { id: postId },
          },
        },
      });

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
    throw new ValidationError("Post not found.", 404);
  }
}
