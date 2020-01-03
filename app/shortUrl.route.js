const { Router } = require('express')

module.exports = Router({mergeParams: true}).get('/:shortUrl', async (req, res, next) => {
  try {
    const { url } = await req.db.ShortUrl.findOneAndUpdate({ _id: req.params.shortUrl }, { $inc : { 'clicks': 1 } })
    res.redirect(url)
  } catch(error) {
    res.sendStatus(404)
  }
})
