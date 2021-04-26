import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    editPassword(
      currentPassword: String!
      newPassword: String!
    ): MutationResult!
  }
`;
