import client from "../../client";
import ValidationError from "../../helpers/ValidationError";
import { deletePhotos } from "../../shared/shared.utils";
import { generateComposedResolver } from "../../user/user.utils";

export default generateComposedResolver({
  Mutation: {
    deletePost: async (_, { postId }, { loggedInUser }) => {
      const existingPost = await getPost({ postId, userId: loggedInUser.id });

      const {
        publicIds,
        commentIds,
        likePostIds,
        likeCommentIds,
      } = processData(existingPost);

      await client.postPhoto.deleteMany({
        where: {
          publicId: { in: publicIds },
        },
      });

      await client.likePost.deleteMany({
        where: {
          id: { in: likePostIds },
        },
      });

      await client.likeComment.deleteMany({
        where: {
          id: { in: likeCommentIds },
        },
      });

      await client.comment.deleteMany({
        where: {
          id: { in: commentIds },
        },
      });

      await client.post.delete({
        where: {
          id: postId,
        },
      });

      // delete hashtags have no post
      await client.hashtag.deleteMany({
        where: {
          posts: { none: {} },
        },
      });

      await deletePhotos(publicIds);

      return { ok: true };
    },
  },
});

async function getPost({ postId, userId }) {
  const post = await client.post.findUnique({
    where: { id: postId },
    select: {
      user: {
        select: { id: true },
      },
      photos: {
        select: { publicId: true },
      },
      comments: {
        select: { id: true, usersLiked: { select: { id: true } } },
      },
      usersLiked: {
        select: { id: true },
      },
    },
  });

  if (!post) {
    throw new ValidationError("Post not found", 404);
  }

  if (post.user.id !== userId) {
    throw new ValidationError(
      "You are not authorized to delete this post",
      403
    );
  }

  return post;
}

function processData(post) {
  const publicIds = post.photos.map((photo) => photo.publicId);
  const commentIds = post.comments.map((comment) => comment.id);
  const likePostIds = post.usersLiked.map((likePost) => likePost.id);
  const likeCommentIds = post.comments
    .flatMap((comment) => comment.usersLiked)
    .map((likeComment) => likeComment.id);
  return { publicIds, commentIds, likePostIds, likeCommentIds };
}
