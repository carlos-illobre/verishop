const { ApolloServer } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const { gql } = require('apollo-server-express')
const { fileLoader, mergeTypes } = require('merge-graphql-schemas')

module.exports = async ({ app, db }) => {
  
  const apollo = new ApolloServer({
    schema: makeExecutableSchema({
      typeDefs: [
        gql(mergeTypes(fileLoader(`${__dirname}/**/*.gql`), { all: true })),
      ],
      resolvers: [
        ...fileLoader(`${__dirname}/**/*.resolver.js`),
      ],
    }),
    context: ({ req, connection }) => connection ? connection.context : {
      db,
      host: req.get('host'),
    },
    playground: {
      settings: {
        'tracing.hideTracingResponse': false,
      },
    },
    formatError: error => {
      return error
    },
    formatResponse: response => {
      return response
    },
  })
  
  apollo.applyMiddleware({ app })
                            
  return apollo

}
