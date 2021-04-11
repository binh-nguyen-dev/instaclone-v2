import { gql } from "apollo-server-core";

export default gql`
  type Query {
    seeUsersLikeComment(commentId: Int!, cursor: Int, take: Int): [User!]!
  }
`;
