const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

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

      type User {
        _id: ID
        email: String!
        password: String
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input UserInput {
        email: String!
        password: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
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
          date: new Date(args.eventInput.date),
          creator: '5c356a2c2cb63640f0a1206a'
        });
        let createdEvent;
        return event
          .save()
          .then(result => {
            createdEvent = {
              ...result._doc,
              _id: result._doc._id.toString()
            }
            return User.findById('5c356a2c2cb63640f0a1206a')
          })
          .then(user => {
            if (!user) {
              throw new Error('User not found');
            }
            user.createdEvents.push(event);
            return user.save();
          })
          .then(result => {
            return createdEvent;
          })
          .catch(err => {
            throw err;
          });
      },
      createUser: args => {
        return User.findOne({
            email: args.userInput.email
          })
          .then(user => {
            if (user) {
              throw new Error('User exist already');
            }
            return bcrypt.hash(args.userInput.password, 12)
          })
          .then(hashedPassword => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword
            });
            return user.save();
          })
          .then(result => ({
            ...result._doc,
            password: null,
            _id: result._doc._id.toString()
          }))
          .catch(error => {
            throw error;
          });
      }
    },
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
