import client from "../../client";
import { deletePhotos, uploadPhoto } from "../../shared/shared.utils";
import { generateComposedResolver } from "../user.utils";

export default generateComposedResolver({
  Mutation: {
    editAvatar: async (_, { avatar }, { loggedInUser }) => {
      let resourcesForDelete;

      try {
        const oldAvatar = await getOldAvatar(loggedInUser.id);

        const { url, public_id } = await processAvatar(avatar, {
          oldAvatar,
          userId: loggedInUser.id,
        });
        resourcesForDelete = public_id;

        if (oldAvatar) {
          await client.avatar.update({
            where: { publicId: oldAvatar.publicId },
            data: { url, publicId: public_id },
          });
        } else {
          await client.avatar.create({
            data: {
              url,
              publicId: public_id,
              user: { connect: { id: loggedInUser.id } },
            },
          });
        }

        return { ok: true };
      } catch (error) {
        await deletePhotos(resourcesForDelete);
        throw error;
      }
    },
  },
});

async function getOldAvatar(userId) {
  const user = await client.user.findUnique({
    where: { id: userId },
    select: {
      avatar: true,
    },
  });

  return user.avatar;
}

async function processAvatar(avatar, { oldAvatar, userId }) {
  if (oldAvatar) {
    await deletePhotos(oldAvatar.publicId);
  }

  const newAvatar = await uploadPhoto(userId, {
    photo: avatar,
    folderName: "avatars",
  });

  return newAvatar;
}
