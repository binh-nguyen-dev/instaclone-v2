import { gql } from "apollo-server-core";

export default gql`
  type Query {
    sayHello: String!
  }

  type User {
    id: Int!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    bio: String
    createdAt: String!
    updatedAt: String!
    posts: [Post!]!
    avatar: Avatar
    comments: [Comment!]!
    postsLiked: [Post!]!
    commentsLiked: [Comment!]!
    followings: [User!]!
    followers: [User!]!
    totalPosts: Int!
    totalFollowings: Int!
    totalFollowers: Int!
    isMe: Boolean!
    isFollowing: Boolean!
  }

  type Avatar {
    id: Int!
    url: String!
    publicId: String!
    createdAt: String!
    updatedAt: String!
  }
`;
