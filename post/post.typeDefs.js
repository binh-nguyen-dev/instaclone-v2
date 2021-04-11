import { gql } from "apollo-server-core";

export default gql`
  type Post {
    id: Int!
    caption: String
    totalUsersLiked: Int!
    createdAt: String!
    updatedAt: String!
    user: User
    hashtags: [Hashtag!]!
    photos: [PostPhoto!]!
    comments(cursor: Int, take: Int): [Comment!]!
    totalComments: Int!
    isMine: Boolean!
    isLiked: Boolean!
  }

  type Hashtag {
    id: Int!
    name: String!
    createdAt: String!
    updatedAt: String!
    topPosts(nPosts: Int): [Post!]!
    mostRecentPosts(cursor: Int, take: Int): [Post!]!
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
