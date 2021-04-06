import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    createPost(caption: String, photos: [Upload!]!): MutationResult!
  }
`;
