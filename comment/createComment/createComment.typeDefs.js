import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    createComment(content: String!, postId: Int!): MutationResult!
  }
`;
