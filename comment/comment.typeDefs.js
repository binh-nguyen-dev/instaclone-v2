import { gql } from "apollo-server-core";

export default gql`
  type Comment {
    id: Int!
    content: String!
    createdAt: String!
    updatedAt: String!
    user: User
    usersLiked: [User!]!
    post: Post!
  }
`;
