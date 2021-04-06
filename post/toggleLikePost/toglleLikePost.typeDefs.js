import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    toggleLikePost(postId: Int!): MutationResult!
  }
`;
