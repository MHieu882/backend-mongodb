import User from '../model/user.js';
import ShortUrl from '../model/shortUrl.js';
import clientRedis from '../redis/db.js';

class Admincontroller {
  async disable(req, res) {
    const formData = req.body;
    const listuser = await User.find({ role: 'user' });
    const shortUrls = await ShortUrl.find();
    await User.updateOne({ username: formData }, { active: 'disable' });
    res.render('admin', { listuser, shortUrls });
  }

  async active(req, res) {
    const formData = req.body;
    const shortUrls = await ShortUrl.find();
    const listuser = await User.find({ role: 'user' });
    await User.updateOne({ username: formData }, { active: 'active' });
    res.render('admin', { listuser, shortUrls });
  }

  async deletebyadmin(req, res) {
    const formData = req.body;
    await ShortUrl.deleteOne({ _id: formData });
    const shortUrls = await ShortUrl.find();
    const listuser = await User.find({ role: 'user' });
    res.render('admin', { listuser, shortUrls });
  }

  async logoutuser(req, res) {
    const formData = req.body.username;
    const getuser = await clientRedis.lrange(formData, 0, -1);
    await clientRedis.del(getuser);
    await clientRedis.del(formData);
    console.log('succesfully!!!');
    const shortUrls = await ShortUrl.find();
    const listuser = await User.find({ role: 'user' });
    res.render('admin', { listuser, shortUrls });
  }
}
export default new Admincontroller();
