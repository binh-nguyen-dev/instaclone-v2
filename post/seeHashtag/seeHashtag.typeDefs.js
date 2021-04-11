import { gql } from "apollo-server-core";

export default gql`
  type Query {
    seeHashtag(name: String!): Hashtag!
  }
`;
