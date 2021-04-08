import { gql } from "apollo-server-core";

export default gql`
  type Query {
    seeFollowings(username: String!, cursor: Int, take: Int): [User!]!
  }
`;
