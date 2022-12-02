import home from './home.js';
import user from './user.js';
import admin from './admin.js';

function routes(app) {
  app.use('/login', user);
  app.use('/admin',admin);
  app.use('/', home);// last
}
export default routes;
