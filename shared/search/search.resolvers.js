import client from "../../client";
import ValidationError from "../../helpers/ValidationError";

export default {
  Query: {
    search: async (_, { keyword, take = 10 }) => {
      if (!keyword) {
        throw new ValidationError(`"keyword" can not be a empty string`);
      }

      let searchUsersBy, searchHashtagsBy;
      if (keyword.startsWith("#")) {
        searchHashtagsBy = keyword;
      } else {
        searchUsersBy = keyword;
        searchHashtagsBy = `#${keyword}`;
      }

      let users = [],
        hashtags = [];
      if (searchUsersBy) {
        users = await client.user.findMany({
          where: {
            OR: [
              { username: { contains: searchUsersBy, mode: "insensitive" } },
              { bio: { contains: searchUsersBy, mode: "insensitive" } },
            ],
          },
          take,
        });
      }
      if (searchHashtagsBy) {
        hashtags = await client.hashtag.findMany({
          where: {
            name: { contains: searchHashtagsBy, mode: "insensitive" },
          },
          take,
        });
      }

      return { users, hashtags };
    },
  },
};
