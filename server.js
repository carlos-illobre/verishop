const port = process.env.PORT || 8080

const createDatabase = require('./database/createDatabase.js')
const createExpressApp = require('./app/createExpressApp.js')
const http = require('http')

module.exports = (async () => {

  const db = await createDatabase()
  const { app, apollo } = await createExpressApp({ db })

  return http.createServer()
    .on('request', app)
    .on('listening', function() {
        const addr = this.address()
        const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
      console.log(`Graphql server ready at http://localhost:${port}${apollo.graphqlPath}`)
    })
    .on('error', function(error) {
      if (error.syscall !== 'listen') throw error
      const addr = this.address() || { port }
      const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
      switch (error.code) {
        case 'EACCES':
          logger.error(`${bind} requires elevated privileges`)
          return process.exit(1)
        case 'EADDRINUSE':
          logger.error(`${bind} is already in use`)
          return process.exit(1)
        default:
          throw error
      }
    })
    .listen(port)

})()
