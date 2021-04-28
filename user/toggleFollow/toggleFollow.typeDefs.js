import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    toggleFollow(userId: Int!): MutationResult!
  }
`;
