require("module-alias/register");
require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
import { typeDefs, resolvers } from "./schema";
import globalErrorHandling from "./helpers/globalErrorHandling";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: globalErrorHandling,
});

const app = express();

server.applyMiddleware({ app });

const PORT = process.env.PORT;
app.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
