import client from "../../client";
import ValidationError from "../../helpers/ValidationError";
import { generateComposedResolver } from "../../user/user.utils";

export default generateComposedResolver({
  Mutation: {
    toggleLikeComment: async (_, { commentId }, { loggedInUser }) => {
      await checkCommentExist(commentId);

      const meLikeComment = await checkMeLikeComment({
        userId: loggedInUser.id,
        commentId,
      });

      if (meLikeComment) {
        await client.likeComment.delete({
          where: {
            userId_commentId: {
              userId: loggedInUser.id,
              commentId,
            },
          },
        });
      } else {
        await client.likeComment.create({
          data: {
            user: { connect: { id: loggedInUser.id } },
            comment: { connect: { id: commentId } },
          },
        });
      }

      return { ok: true };
    },
  },
});

async function checkCommentExist(commentId) {
  const comment = await client.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new ValidationError("Comment not found", 404);
  }
}

async function checkMeLikeComment({ userId, commentId }) {
  const meLikeComment = await client.likeComment.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  return Boolean(meLikeComment);
}
