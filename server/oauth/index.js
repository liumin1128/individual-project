import Router from 'koa-router';
import outlook from './outlook';

const router = new Router();

export default router
  .get('/outlook', outlook.login)
  .get('/outlook/callback', outlook.callback)
  .get('/outlook/test', outlook.test);
