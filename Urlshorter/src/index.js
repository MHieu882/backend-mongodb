import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import ConnectRedis from 'connect-redis';
import routes from './routes/index.js';
import clientRedis from './redis/db.js'
// connect mongodb
mongoose.connect('mongodb://localhost:27017/urlShortener');


// import routes fr
const app = express();
const port = process.env.PORT || 3000;
//connect redis

const RedisStore = ConnectRedis(session);

app.use(session({
  store: new RedisStore({ client: clientRedis }),
  secret: 'ses123#@',
  saveUninitialized: false,
  cookie: { secure: false,
    httpOnly: true,
    maxAge: 300000 },
  resave: false,
}));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
routes(app);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
