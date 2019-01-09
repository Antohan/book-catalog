const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphQlHttp({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
  `),
    rootValue: {
      events: () => {
        return Event.find()
          .then(events =>
            events.map(event => ({
              ...event._doc,
              _id: event.id
            }))
          )
          .catch(err => {
            console.log(err);
          });
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date)
        });
        return event
          .save()
          .then(result => {
            console.log(result);
            return { ...result._doc, _id: event._doc._id.toString() };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      }
    },
    graphiql: true
  })
);

const mongoConnectUrl = `mongodb://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@ds251894.mlab.com:51894/${process.env.MONGO_DB}`;

const url = 'mongodb://admin:admin123@ds251894.mlab.com:51894/book-catalog';

mongoose
  .connect(mongoConnectUrl)
  .then(() => {
    app.listen(9000);
  })
  .catch(err => console.log(err));
