import client from "../client";

export default {
  User: {
    avatar: async ({ id: userId }) => {
      return client.avatar.findFirst({
        where: { userId },
      });
    },
    totalPosts: async ({ id: userId }) => {
      return client.post.count({ where: { user: { id: userId } } });
    },
    totalFollowings: async ({ id: userId }) => {
      return client.user.count({
        where: { followers: { some: { id: userId } } },
      });
    },
    totalFollowers: async ({ id: userId }) => {
      return client.user.count({
        where: { followings: { some: { id: userId } } },
      });
    },
    isMe: async ({ id: userId }, args, { loggedInUser }) => {
      if (!loggedInUser) return false;
      return loggedInUser.id === userId;
    },
    isFollowing: async ({ id: userId }, args, { loggedInUser }) => {
      if (!loggedInUser) return false;

      const user = await client.user.findFirst({
        where: {
          id: userId,
          followers: {
            some: { id: loggedInUser.id },
          },
        },
      });

      return Boolean(user);
    },
    fullName: ({ firstName, lastName }) => {
      return lastName ? firstName + " " + lastName : firstName;
    },
  },
};
