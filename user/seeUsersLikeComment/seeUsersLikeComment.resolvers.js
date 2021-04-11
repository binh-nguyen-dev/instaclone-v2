import client from "../../client";
import ValidationError from "../../helpers/ValidationError";

export default {
  Query: {
    seeUsersLikeComment: async (_, { commentId, cursor, take = 20 }) => {
      await checkCommentExist(commentId);

      const usersLikeComment = await client.user.findMany({
        where: {
          commentsLiked: { some: { commentId } },
        },
        ...(cursor && { cursor: { id: cursor } }),
        skip: cursor ? 1 : 0,
        take,
      });

      return usersLikeComment;
    },
  },
};

async function checkCommentExist(commentId) {
  const comment = await client.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new ValidationError("Comment not found");
  }
}
