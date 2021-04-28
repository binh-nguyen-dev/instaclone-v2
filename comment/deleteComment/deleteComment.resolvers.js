import client from "../../client";
import ValidationError from "../../helpers/ValidationError";
import { generateComposedResolver } from "../../user/user.utils";

export default generateComposedResolver({
  Mutation: {
    deleteComment: async (_, { commentId }, { loggedInUser }) => {
      const existingComment = await getComment({
        commentId,
        userId: loggedInUser.id,
      });

      const { likeCommentIds } = processData(existingComment);

      await client.likeComment.deleteMany({
        where: {
          id: { in: likeCommentIds },
        },
      });

      await client.comment.delete({
        where: {
          id: commentId,
        },
      });

      return { ok: true };
    },
  },
});

async function getComment({ commentId, userId }) {
  const comment = await client.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      user: { select: { id: true } },
      usersLiked: { select: { id: true } },
    },
  });

  if (!comment) {
    throw new ValidationError("Comment not found", 404);
  }

  if (comment.user.id !== userId) {
    throw new ValidationError("You are authorized to delete this comment", 403);
  }

  return comment;
}

function processData(comment) {
  const likeCommentIds = comment.usersLiked.map((userLiked) => userLiked.id);

  return { likeCommentIds };
}
