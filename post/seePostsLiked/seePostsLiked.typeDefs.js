import { gql } from "apollo-server-core";

export default gql`
  type Query {
    seePostsLiked(username: String!, cursor: Int, take: Int): [Post!]!
  }
`;
