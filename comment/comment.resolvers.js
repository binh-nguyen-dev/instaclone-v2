import client from "../client";

export default {
  Comment: {
    user: async ({ userId }) => {
      return client.user.findUnique({
        where: { id: userId },
      });
    },
    totalUsersLiked: async ({ id: commentId }) => {
      return client.user.count({
        where: {
          commentsLiked: { some: { commentId } },
        },
      });
    },
    isMine: async ({ userId }, args, { loggedInUser }) => {
      if (!loggedInUser) return false;

      return loggedInUser.id === userId;
    },
    isLiked: async ({ id: commentId }, args, { loggedInUser }) => {
      if (!loggedInUser) return false;

      const likedComment = await client.comment.findFirst({
        where: {
          id: commentId,
          usersLiked: { some: { userId: loggedInUser.id } },
        },
      });

      return Boolean(likedComment);
    },
  },
};
