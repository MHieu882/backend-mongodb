import User from '../model/user.js';
import ShortUrl from '../model/shortUrl.js';
import clientRedis from '../redis/db.js'
class UserController {
  async disable(req, res, next) {
    const formData = req.body;
    const status = 'disable';
    const listuser = await User.find({ role: 'user' });
    const shortUrls = await ShortUrl.find();
    User.updateOne({ username: formData }, { active: status })
      .then(() => res.render('admin', { listuser, shortUrls }))
      .catch(next);
  }

  async active(req, res, next) {
    const formData = req.body;
    const status = 'active';
    const shortUrls = await ShortUrl.find();
    const listuser = await User.find({ role: 'user' });
    User.updateOne({ username: formData }, { active: status })
      .then(() => res.render('admin', { listuser, shortUrls }))
      .catch(next);
  }

  async deletebyadmin(req, res) {
    const formData = req.body;
    await ShortUrl.deleteOne({ _id: formData });
    const shortUrls = await ShortUrl.find();
    const listuser = await User.find({ role: 'user' });
    res.render('admin', { listuser, shortUrls });
  }
  async logoutuser(req,res){
    const formData = req.body.username;
    const getuser=await clientRedis.lrange(formData,0,-1)
    await clientRedis.del(getuser)
    await clientRedis.del(formData)
    console.log('succesfully!!!')
    const shortUrls = await ShortUrl.find();
    const listuser = await User.find({ role: 'user' });
    res.render('admin', { listuser, shortUrls });
  }
}
export default new UserController();
