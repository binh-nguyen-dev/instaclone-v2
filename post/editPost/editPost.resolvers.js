import client from "../../client";
import ValidationError from "../../helpers/ValidationError";
import { generateComposedResolver } from "../../user/user.utils";
import runValidation from "../../validations";
import { editPostSchema } from "../../validations/posts.validations";
import { parseCaption } from "../post.utils";

export default generateComposedResolver({
  Mutation: {
    editPost: async (_, { postId, caption: newCaption }, { loggedInUser }) => {
      await runValidation(editPostSchema, { caption: newCaption });
      const existingPost = await getPost({ postId, userId: loggedInUser.id });

      const dataForHashtags = await processCaption(existingPost, newCaption);

      await client.post.update({
        where: { id: postId },
        data: {
          caption: newCaption,
          hashtags: dataForHashtags,
        },
      });

      // delete all hashtags have no post
      await client.hashtag.deleteMany({
        where: {
          posts: { none: {} },
        },
      });

      return { ok: true };
    },
  },
});

async function getPost({ postId, userId }) {
  const post = await client.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      hashtags: {
        select: { id: true },
      },
      user: {
        select: { id: true },
      },
    },
  });

  if (!post) {
    throw new ValidationError("Post not found", 404);
  }

  if (post.user.id !== userId) {
    throw new ValidationError(
      "You are not authorized to update this post",
      403
    );
  }

  return post;
}

async function processCaption(post, caption) {
  const newHashtags = parseCaption(caption);

  const dataForHashtags = {
    disconnect: post.hashtags,
    connectOrCreate: newHashtags.map((hashtag) => ({
      where: { name: hashtag },
      create: { name: hashtag },
    })),
  };

  return dataForHashtags;
}
