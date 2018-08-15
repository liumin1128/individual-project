import Router from 'koa-router';
import github from './github';
import outlook from './outlook';

const router = new Router();

export default router
  .get('/github', github.login)
  .get('/github/callback', github.callback)
  .get('/outlook', outlook.login)
  .get('/outlook/callback', outlook.callback)
  .get('/outlook/test', outlook.test);
