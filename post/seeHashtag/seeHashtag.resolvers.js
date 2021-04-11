import client from "../../client";
import ValidationError from "../../helpers/ValidationError";

export default {
  Query: {
    seeHashtag: async (_, { name }) => {
      const hashtag = await client.hashtag.findUnique({
        where: { name },
      });

      if (!hashtag) {
        throw new ValidationError("Hashtag not found", 404);
      }

      return hashtag;
    },
  },
};
