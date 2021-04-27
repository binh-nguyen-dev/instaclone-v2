import client from "../../client";
import { generateComposedResolver } from "../../user/user.utils";

export default generateComposedResolver({
  Query: {
    seeFeed: async (_, { cursor, take = 10 }, { loggedInUser }) => {
      return client.post.findMany({
        where: {
          OR: [
            { user: { id: loggedInUser.id } },
            { user: { followers: { some: { id: loggedInUser.id } } } },
          ],
        },
        ...(cursor && { cursor: { id: cursor } }),
        skip: cursor ? 1 : 0,
        take,
        orderBy: {
          updatedAt: "desc",
        },
      });
    },
  },
});
