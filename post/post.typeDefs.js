import { gql } from "apollo-server-core";

export default gql`
  type Post {
    id: Int!
    caption: String
    createdAt: String!
    updatedAt: String!
    user: User
    hashtags: [Hashtag!]!
    photos: [PostPhoto!]!
    comments: [Comment!]!
    totalUsersLiked: Int!
    totalComments: Int!
    isMine: Boolean!
    isLiked: Boolean!
  }

  type Hashtag {
    id: Int!
    name: String!
    createdAt: String!
    updatedAt: String!
    posts: [Post!]!
    totalPosts: Int!
  }

  type PostPhoto {
    id: Int!
    url: String!
    publicId: String!
    createdAt: String!
    updatedAt: String!
  }
`;
