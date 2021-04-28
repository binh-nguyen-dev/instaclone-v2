import client from "../../client";
import ValidationError from "../../helpers/ValidationError";
import { generateComposedResolver } from "../user.utils";

export default generateComposedResolver({
  Mutation: {
    toggleFollow: async (_, { userId }, { loggedInUser }) => {
      await checkUserExist({ userId, loggedInUser });

      const meFollowed = await checkMeFollowed({ userId, loggedInUser });
      if (meFollowed) {
        await client.user.update({
          where: { id: loggedInUser.id },
          data: { followings: { disconnect: { id: userId } } },
        });
      } else {
        await client.user.update({
          where: { id: loggedInUser.id },
          data: { followings: { connect: { id: userId } } },
        });
      }

      return { ok: true };
    },
  },
});

async function checkUserExist({ userId, loggedInUser }) {
  const userToToggleFollow = await client.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!userToToggleFollow) {
    throw new ValidationError("User not found", 404);
  }

  if (userToToggleFollow.id === loggedInUser.id) {
    throw new ValidationError("You can not follow/unfollow yourself", 400);
  }
}

async function checkMeFollowed({ userId, loggedInUser }) {
  const user = await client.user.findFirst({
    where: {
      id: userId,
      followers: { some: { id: loggedInUser.id } },
    },
  });

  return Boolean(user);
}
