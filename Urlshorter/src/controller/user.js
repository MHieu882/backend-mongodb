import bcrypt from 'bcryptjs';
import User from '../model/user.js';
import ShortUrl from '../model/shortUrl.js';
import clientRedis from '../redis/db.js';
import nodemailer from 'nodemailer';
class UserController {
  async index(req, res) {
    const salt = bcrypt.genSaltSync(10);
    const hastPassword = await bcrypt.hash('admin', salt);
    User.find((err, users) => {
      if (users.length) {} else {
        new User({
          username: 'admin',
          password: hastPassword,
          role: 'admin',
        }).save(err => {
          if (err) throw err;
          console.log('admin account was created');
        });
      }
    });
    res.render('login');
  }

  async login(req, res) {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.send('tk khong ton tai');
    }
    const checkpassword = await bcrypt.compare(req.body.password, user.password);
    if (!checkpassword) {
      return res.send('sai mk');
    }
    req.session.username = user.username;
    req.session.role = user.role;
    await clientRedis.lpush(user.username, `sess:${req.session.id}`);
    await clientRedis.expire(user.username, 300);
    if (req.session.role === 'user') {
      if (user.active === 'active') {
        const shortUrls = await ShortUrl.find({ username: req.body.username });
        res.render('home', { shortUrls });
      }
      if (user.active === 'disable') {
        res.send('tk da bi khoa');
        req.session.destroy();
      }
    }
    const shortUrls = await ShortUrl.find();
    const listuser = await User.find({ role: 'user' });
    res.render('admin', { listuser, shortUrls });
  }

  async register(req, res) {
    const username = await User.findOne({ username: req.body.username });
    if (!username) {
      const salt = bcrypt.genSaltSync(10);
      const hastPassword = await bcrypt.hash(req.body.password, salt);
      const user = new User({ username: req.body.username,email:req.body.email,
        password: hastPassword });
      user.save();
      res.render('login');
    } else {
      res.send('tk da ton tai');
    }
  }

  async DestroyUrl(req, res) {
    const formData = req.body;
    await ShortUrl.deleteOne({ _id: formData });
    const shortUrls = await ShortUrl.find({ username: req.session.username });
    res.render('home', { shortUrls });
  }

  async getchange(req, res, next) {
    res.render('ChangePass');
  }

  async Changepass(req, res, next) {
    const UserChange = await User.findOne({ username: req.session.username });
    if (!UserChange) {
      return res.send('tk k ton tai');
    }
    const checkpassword = await bcrypt.compare(req.body.oldpassword, UserChange.password);
    if (checkpassword) {
      if (req.body.newpassword1 === req.body.newpassword2) {
        const salt = bcrypt.genSaltSync(10);
        const hastPassword = await bcrypt.hash(req.body.newpassword1, salt);
        User.updateOne({ username: req.session.username }, { password: hastPassword })
          .then(() => res.render('login'))
          .catch(next);
      } else {
        return res.render('ChangePass');
      }
    } else {
      return res.render('ChangePass');
    }
  }

  async logout(req, res) {
    req.session.destroy();
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls });
  }
  getreset(req,res){
    res.render('resetpass')
  }
  async sendmail(req,res) {
    const form= req.body.email;
    const user=await User.find({email:form})
    let transporter= nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure:false,
      service:'gmail',
      auth: {
        user: 'mhie8822.py@gmail.com', 
        pass: 'pcgtbrfnknpltvvs', 
      },
    });
    let mailOptions = {
      from: 'mhie8822.py@gmail.com', // sender address
      to: form, 
      subject: "Reset password", // Subject line
      text: `http://localhost:3000/login/newpassword`, // plain text body
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.render('newpassword')
  }
}
export default new UserController();
