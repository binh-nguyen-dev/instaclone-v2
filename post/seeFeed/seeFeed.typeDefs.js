import { gql } from "apollo-server-core";

export default gql`
  type Query {
    seeFeed(cursor: Int, take: Int): [Post!]!
  }
`;
