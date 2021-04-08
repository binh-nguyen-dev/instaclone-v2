import { gql } from "apollo-server-core";

export default gql`
  type Query {
    seeUserPosts(username: String!, cursor: Int, take: Int): [Post!]!
  }
`;
