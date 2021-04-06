import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    toggleLikeComment(commentId: Int!): MutationResult!
  }
`;
