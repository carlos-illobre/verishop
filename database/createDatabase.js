const glob = require('glob')
const path = require('path')
const mongoose = require('mongoose')

module.exports = async () => {

  const url = 'mongodb://educacionit:educacionit@ds231739.mlab.com:31739/educacionit'
      
  mongoose.set('debug', (coll, method, query, doc, options = {}) => {
    console.log(`${coll},${method},${JSON.stringify(query)},${JSON.stringify(options)}`)
  })

  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

  const db = glob.sync('./models/**/*.js', { cwd: __dirname, ignore: '../models/**/*.test.js' })
    .map(filename => ({
      schema: require(filename),
      name: path.basename(filename).replace(path.extname(filename), ''),
    }))
    .map(({ name, schema }) => mongoose.model(name, schema))
    .reduce((db, model) => ({ ...db, [model.modelName]: model }), {})

  db.mongoose = mongoose

  return new Promise((resolve, reject) => {
    mongoose.connection.once('open', () => {
      console.log(`MongoDB connected at ${url}`)
      resolve(db)
    })
  })

}
