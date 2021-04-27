const cloudinary = require("cloudinary").v2;
import client from "../../client";
import { uploadPhotos } from "../../shared/shared.utils";
import { generateComposedResolver } from "../../user/user.utils";
import runValidation from "../../validations";
import { createPostSchema } from "../../validations/posts.validations";
import { parseCaption } from "../post.utils";

export default generateComposedResolver({
  Mutation: {
    createPost: async (_, args, { loggedInUser }) => {
      let resourcesForDelete;

      try {
        await runValidation(createPostSchema, args);

        const { publicIds, data } = await processData(loggedInUser, args);
        resourcesForDelete = publicIds;

        await client.post.create({ data });
      } catch (error) {
        if (resourcesForDelete)
          await cloudinary.api.delete_resources(resourcesForDelete);
        throw error;
      }

      return { ok: true };
    },
  },
});

async function processData(loggedInUser, { caption, photos }) {
  let dataForHashtags;
  if (caption) {
    dataForHashtags = processCaption(caption);
  }

  const dataForPhotos = await processPhotos(loggedInUser.id, photos);

  return {
    data: {
      caption,
      user: { connect: { id: loggedInUser.id } },
      hashtags: {
        connectOrCreate: dataForHashtags,
      },
      photos: {
        create: dataForPhotos,
      },
    },
    publicIds: dataForPhotos.map(({ publicId }) => publicId),
  };
}

function processCaption(caption) {
  const hashtags = parseCaption(caption);

  const dataForHashtags = hashtags.map((hashtag) => ({
    create: { name: hashtag },
    where: { name: hashtag },
  }));

  return dataForHashtags;
}

async function processPhotos(userId, photos) {
  const uploadedPhotos = await uploadPhotos(userId, {
    photos,
    folderName: "posts",
  });

  const dataForPhotos = uploadedPhotos.map(({ url, public_id }) => ({
    url,
    publicId: public_id,
  }));

  return dataForPhotos;
}
