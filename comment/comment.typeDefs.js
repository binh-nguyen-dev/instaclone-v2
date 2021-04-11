import { gql } from "apollo-server-core";

export default gql`
  type Comment {
    id: Int!
    content: String!
    createdAt: String!
    updatedAt: String!
    user: User
    totalUsersLiked: Int!
    isMine: Boolean!
    isLiked: Boolean!
  }
`;
