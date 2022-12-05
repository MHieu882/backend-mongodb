import ShortUrl from '../model/shortUrl.js';

class ShortUrlController {
  async index(req, res) {
    if (!req.session.username) {
      const shortUrls = await ShortUrl.find();
      res.render('index', { shortUrls });
    }
    const shortUrls = await ShortUrl.find({ username: req.session.username });
    res.render('home', { shortUrls });
  }

  async ShortUrl(req, res) {
    if (req.session.username) {
      await ShortUrl.create({ full: req.body.fullUrl, CreateAt: Date.now(), username: req.session.username });
      const shortUrls = await ShortUrl.find({ username: req.session.username });
      res.render('home', { shortUrls });
    } else {
      await ShortUrl.create({ full: req.body.fullUrl, CreateAt: Date.now() });
      const shortUrls = await ShortUrl.find();
      res.render('index', { shortUrls });
    }
  }

  async getShorturl(req, res) {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (!shortUrl) {
      return res.status(404).send({
        errCode: -5,
        message: 'The shorten url is not found',
      });
    }
    await ShortUrl.updateOne({ _id: shortUrl._id }, { $inc: { clicks: 1 } });
    res.redirect(shortUrl.full);
  }
}
export default new ShortUrlController();
