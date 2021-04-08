import { gql } from "apollo-server-core";

export default gql`
  type User {
    id: Int!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    bio: String
    createdAt: String!
    updatedAt: String!
    avatar: Avatar
    totalPosts: Int!
    totalFollowings: Int!
    totalFollowers: Int!
    isMe: Boolean!
    isFollowing: Boolean!
    fullName: String!
  }

  type Avatar {
    id: Int!
    url: String!
    publicId: String!
    createdAt: String!
    updatedAt: String!
  }
`;
