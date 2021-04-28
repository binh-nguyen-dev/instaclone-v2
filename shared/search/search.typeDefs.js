import { gql } from "apollo-server-core";

export default gql`
  type SearchResult {
    users: [User!]!
    hashtags: [Hashtag!]!
  }

  type Query {
    search(keyword: String!, take: Int): SearchResult!
  }
`;
