import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import routes from './routes/index.js';
// import routes fr
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'ses123$', resave: true, maxAge: 2592000000, saveUninitialized: true }));

routes(app);
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
