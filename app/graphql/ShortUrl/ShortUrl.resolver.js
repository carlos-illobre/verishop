module.exports = {
  Query: {
    getClicks: async (root, { shortUrl }, { db }, info) => {
      const { clicks } = await db.ShortUrl.findById(shortUrl)
      return clicks
    },
  },
  Mutation: {
    createShortUrl: async (root, { url }, { db, host }, info) => {
      const { _id } = await db.ShortUrl.create({ url: url.startsWith('http') ? url : `http://${url}` })
      return `${host}/${_id}`
    },
  }
}
