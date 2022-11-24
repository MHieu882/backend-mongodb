import home from './home.js';
import user from './user.js';

function routes(app) {
  app.use('/login', user);
  app.use('/', home);// last
}
export default routes;
