import client from "../client";

export default {
  Post: {
    user: async ({ userId }) => {
      return client.user.findUnique({
        where: { id: userId },
      });
    },
    hashtags: async ({ id: postId }) => {
      return client.hashtag.findMany({
        where: {
          posts: { some: { id: postId } },
        },
      });
    },
    photos: async ({ id: postId }) => {
      return client.postPhoto.findMany({
        where: { postId },
      });
    },
    totalUsersLiked: async ({ id: postId }) => {
      return client.user.count({
        where: {
          postsLiked: {
            some: { postId },
          },
        },
      });
    },
    totalComments: async ({ id: postId }) => {
      return client.comment.count({
        where: {
          post: { id: postId },
        },
      });
    },
    isMine: async ({ id: postId }, args, { loggedInUser }) => {
      if (!loggedInUser) return false;

      const post = await client.post.findFirst({
        where: {
          id: postId,
          userId: loggedInUser.id,
        },
      });

      return Boolean(post);
    },
    isLiked: async ({ id: postId }, args, { loggedInUser }) => {
      if (!loggedInUser) return false;

      const post = await client.post.findFirst({
        where: {
          id: postId,
          usersLiked: {
            some: { userId: loggedInUser.id },
          },
        },
      });

      return Boolean(post);
    },
    comments: async ({ id: postId }, { cursor, take = 10 }) => {
      return client.post.findUnique({ where: { id: postId } }).comments({
        ...(cursor && { cursor: { id: cursor } }),
        skip: cursor ? 1 : 0,
        take,
      });
    },
  },
};
