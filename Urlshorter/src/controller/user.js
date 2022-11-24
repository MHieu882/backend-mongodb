import User from '../model/user.js';
import ShortUrl from '../model/shortUrl.js';

class UserController {
  index(req, res) {
    res.render('login');
  }

  async home(req, res) {
    const username = await User.findOne({ username: req.body.username });
    const formData = req.body;
    const shortUrls = await ShortUrl.find({ username: formData.username });
    if (!username) {
      return res.render('login');
    }
    if (formData.password === username.password) {
      req.session.username = username.username;
      res.render('home', { shortUrls });
    } else {
      return res.render('login');
    }
  }

  async register(req, res) {
    const username = await User.findOne({ username: req.body.username });
    const formData = req.body;
    if (!username) {
      await User.insertMany(formData);
      return res.redirect('login');
    }res.render('login');
  }

  async DestroyUrl(req, res) {
    const formData = req.body;
    await ShortUrl.deleteOne({ _id: formData });
    const shortUrls = await ShortUrl.find({ username: req.session.username });
    res.render('home', { shortUrls });
  }

  async logout(req, res) {
    req.session.destroy();
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls });
  }
}
export default new UserController();
