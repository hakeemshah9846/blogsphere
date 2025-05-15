const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const typeDefs = `
  type BlogPost {
    _id: ID!
    title: String!
    content: String!
    author: String!
    createdAt: String!
  }

  type Query {
    posts: [BlogPost!]!
    post(id: ID!): BlogPost
  }

  type Mutation {
    createPost(
      title: String!
      content: String!
      author: String!
    ): BlogPost!
  }
`;

const run = async () => {
  try {

    const client = await MongoClient.connect("mongodb://127.0.0.1:27017/blog", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db();

   const resolvers = {
  Query: {
    posts: async () => {
      try {
        const posts = await db.collection('posts').find().toArray();
        return posts || [];
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw new Error('Failed to fetch posts');
      }
    },
    post: async (_, { id }) => {
      try {
        return await db.collection('posts').findOne({ _id: new ObjectId(id) });
      } catch (error) {
        console.error('Error fetching post:', error);
        throw new Error('Post not found');
      }
    }
  },
   Mutation: {
    createPost: async (_, { title, content, author }) => {
      try {
        const result = await db.collection('posts').insertOne({
          title,
          content,
          author,
          createdAt: new Date().toISOString()
        });
        return {
          _id: result.insertedId,
          title,
          content,
          author,
          createdAt: new Date().toISOString()
        };
      } catch (error) {
        throw new Error('Failed to create post');
      }
    }
  }
};

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({ req, db }),
      introspection: true,
      playground: true,
      debug: true,
      formatError: (error) => {
        console.error("GraphQL Error:", error);
        return {
          message: error.message,
          code: error.extensions?.code || "INTERNAL_SERVER_ERROR",
        };
      },
    });

    const app = express();

    const corsOptions = {
      origin: "http://localhost:3000",
      credentials: true,
    };

    app.use(cors(corsOptions));

    await server.start();
    server.applyMiddleware({ app });

    app.listen(4000, () =>
      console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
    );
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

run();
