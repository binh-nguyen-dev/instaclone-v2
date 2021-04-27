import client from "../../client";
import ValidationError from "../../helpers/ValidationError";
import { generateComposedResolver } from "../../user/user.utils";
import runValidation from "../../validations";
import { editCommentSchema } from "../../validations/comment.validations";

export default generateComposedResolver({
  Mutation: {
    editComment: async (_, { commentId, content }, { loggedInUser }) => {
      await runValidation(editCommentSchema, { content });
      await checkCommentExist({ commentId, userId: loggedInUser.id });

      await client.comment.update({
        where: { id: commentId },
        data: { content },
      });

      return { ok: true };
    },
  },
});

async function checkCommentExist({ commentId, userId }) {
  const comment = await client.comment.findUnique({
    where: { id: commentId },
    select: {
      user: {
        select: { id: true },
      },
    },
  });

  if (!comment) {
    throw new ValidationError("Comment not found", 404);
  }

  if (comment.user.id !== userId) {
    throw new ValidationError(
      "You are not authorized to edit this comment",
      403
    );
  }
}
