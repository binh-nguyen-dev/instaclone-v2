import { gql } from "apollo-server-core";

export default gql`
  type Query {
    seeFollowers(username: String!, cursor: Int, take: Int): [User!]!
  }
`;
