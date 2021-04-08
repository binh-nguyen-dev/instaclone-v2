import { gql } from "apollo-server-core";

export default gql`
  type Query {
    seeUsersLikePost(postId: Int!, cursor: Int, take: Int): [User!]!
  }
`;
