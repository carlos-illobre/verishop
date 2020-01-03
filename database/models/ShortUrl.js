const mongoose = require('mongoose')

module.exports = mongoose.Schema({
  url: String,
  clicks: { type: Number, default: 0 }
})
