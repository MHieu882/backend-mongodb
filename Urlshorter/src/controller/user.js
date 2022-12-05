import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import User from '../model/user.js';
import ShortUrl from '../model/shortUrl.js';
import clientRedis from '../redis/db.js';

class UserController {
  async index(req, res) {
    const salt = bcrypt.genSaltSync(10);
    const hastPassword = await bcrypt.hash('admin', salt);
    const users = await User.find();
    if (!users.length) {
      await User.create({
        username: 'admin',
        email: req.body.email,
        password: hastPassword,
        role: 'admin',
      });
      // eslint-disable-next-line no-console
      console.log('admin account was created');
    }
    res.render('login');
  }

  async login(req, res) {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.send('user not exist');
      return;
    }
    const checkpassword = await bcrypt.compare(req.body.password, user.password);
    if (!checkpassword) {
      res.send('Password invalid');
      return;
    }
    if (user.active === 'disable') {
      res.send('user was disable');
      return;
    }
    req.session.username = user.username;
    req.session.role = user.role;
    await clientRedis.lpush(user.username, `sess:${req.session.id}`);
    await clientRedis.expire(user.username, 300);
    if (req.session.role === 'user') {
      const shortUrls = await ShortUrl.find({ username: req.body.username });
      return res.render('home', { shortUrls });
    }
    if (req.session.role === 'admin') {
      const shortUrls = await ShortUrl.find();
      const listuser = await User.find({ role: 'user' });
      return res.render('admin', { shortUrls, listuser });
    }
  }

  async register(req, res) {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      res.send('user existed');
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    const hastPassword = await bcrypt.hash(req.body.password, salt);
    await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hastPassword,
    });
    res.render('login');
  }

  async DestroyUrl(req, res) {
    const formData = req.body;
    await ShortUrl.deleteOne({ _id: formData });
    const shortUrls = await ShortUrl.find({ username: req.session.username });
    res.render('home', { shortUrls });
  }

  async getchange(req, res) {
    res.render('ChangePass');
  }

  async Changepass(req, res) {
    const user = await User.findOne({ username: req.session.username });
    if (!user) {
      res.send('user not exist');
    }
    const checkpassword = await bcrypt.compare(req.body.oldpassword, user.password);
    if (!checkpassword) {
      res.render('ChangePass');
    }
    if (req.body.newpassword1 !== req.body.newpassword2) {
      res.send('pass 1 and 2 not same');
    }
    const salt = bcrypt.genSaltSync(10);
    const hastPassword = await bcrypt.hash(req.body.newpassword1, salt);
    await User.updateOne({ username: req.session.username }, { password: hastPassword });
    req.session.destroy();
    res.render('login');
  }

  async logout(req, res) {
    req.session.destroy();
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls });
  }

  getreset(req, res) {
    res.render('resetpass');
  }

  async sendmail(req, res) {
    const { email } = req.body;
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      service: 'gmail',
      auth: {
        user: 'mhie8822.py@gmail.com',
        pass: 'pcgtbrfnknpltvvs',
      },
    });
    const mailOptions = {
      from: 'mhie8822.py@gmail.com',
      to: email,
      subject: 'Reset password',
      text: 'mk cu',
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
    res.render('newpassword');
  }
}
export default new UserController();
