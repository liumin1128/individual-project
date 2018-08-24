import Koa from 'koa';
import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';
import KoaStatic from 'koa-static';
import cors from 'koa2-cors';
import helmet from 'koa-helmet';
import jwt from 'koa-jwt';
import mongoose from 'mongoose';
import Oauth from './server/oauth';
import { PORT, DEV, LOCAL, SECRET } from './config';
import error from './middlewares/error_back';
import { graphiql, graphql } from './graphql';

const app = new Koa();
const router = new Router();

const port = process.env.NODE_ENV === 'production' ? 3101 : PORT;

mongoose.connect(LOCAL ? 'mongodb://localhost:27017/mengmengliu' : 'mongodb://react:lol970568830@localhost:27000/mengmengliu');
mongoose.set('debug', true);
mongoose.Promise = global.Promise;

app.use(cors());
app.use(helmet());
app.use(error);
app.use(jwt({ secret: SECRET }).unless({
  path: [
    /^\/graphql/,
    /^\/graphiql/,
    /^\/public/,
    /^\/oauth/,
  ],
}));

app.use(BodyParser({ enableTypes: ['json', 'form', 'text'] }));
app.use(KoaStatic(`${__dirname}/public`));

router
  .use('/oauth', Oauth.routes())
  .post('/graphql', jwt({ secret: SECRET, passthrough: true }), graphql)
  .get('/graphql', graphql)
  .get('/graphiql', graphiql);


app.use(router.routes());

app.listen(port, () => {
  console.log(`localhost: ${port}`);
});
