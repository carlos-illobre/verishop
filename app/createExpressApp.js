const express = require('express')
const bodyParser = require('body-parser')
const createApolloServer = require('./graphql/createApolloServer.js')
const shortUrlRoute = require('./shortUrl.route.js')

module.exports = async ({ db }) => {
  
  const app = express()
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use((req, res, next) => {
      req.db = db
      return next()
    })

  const apollo = await createApolloServer({ app, db })

  app
    .use(shortUrlRoute)
    .use((error, req, res, next) => error.errors 
      ? res.status(400).json(error) 
      : res.status(error.status).send(error.message)
  )


  return { app, apollo }

}
