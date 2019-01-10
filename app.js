const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphQlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

const mongoConnectUrl = `mongodb://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@ds237363.mlab.com:37363/${process.env.MONGO_DB}`;

mongoose
  .connect(mongoConnectUrl)
  .then(() => {
    app.listen(9000);
  })
  .catch(err => console.log(err));