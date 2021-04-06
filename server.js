require("module-alias/register");
require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
import { typeDefs, resolvers } from "./schema";
import globalErrorHandling from "./helpers/globalErrorHandling";
import { getUser } from "./user/user.utils";
import cloudinaryConfig from "./helpers/cloudinaryConfig";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: globalErrorHandling,
  context: async ({ req }) => {
    const loggedInUser = await getUser(req.headers.token);

    return { loggedInUser };
  },
});

const app = express();

app.use(cloudinaryConfig);

server.applyMiddleware({ app });

const PORT = process.env.PORT;
app.listen({ port: PORT }, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
});
