import { URLSearchParams } from 'url';
import config from '../../config/outlook';
import fetch from '../../utils/fetch';
import { User, Oauth } from '../../mongo/modals';
import { DOMAIN } from '../../config';
import { fetchToQiniu } from '../../utils/qiniu';
import { getUserToken } from '../../utils/jwt';

// import { client } from '../../utils/redis';

class OauthClass {
  // 用户注册
  async login(ctx) {
    console.log('一名懵懵懂懂的用户希望从outlook登录');
    console.log('config');
    console.log(config);

    // 重定向到认证接口,并配置参数
    let path = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';

    // client_id 通过注册应用程序生成的客户端ID。这使Azure知道哪个应用程序正在请求登录。
    path += `?client_id=${config.client_id}`;

    // redirect_uri 一旦用户同意应用程序，Azure将重定向到的位置。此值必须与注册应用程序时使用的重定向URI的值相对应
    path += `&redirect_uri=${encodeURI(config.redirect_uri)}`;

    // response_type 应用程序期望的响应类型。对于授权授权流程，应始终如此code
    path += `&response_type=${config.response_type}`;

    // scope 您的应用所需的以空格分隔的访问范围列表。有关Microsoft Graph中Outlook范围的完整列表
    // 具体参考：https://developer.microsoft.com/graph/docs/authorization/permission_scopes
    path += `&scope=${config.scope}`;

    // 转发到授权服务器
    ctx.redirect(path);
  }

  async callback(ctx) {
    try {
      const { code } = ctx.query;
      console.log('哇塞，又个单纯可爱的用户把code交到了你的手中，哇咔咔');
      console.log(`code：${code}`);

      // 下面构造个post请求，换取用户信息
      const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
      const params = {
        // client_id：通过注册应用程序生成的客户端ID
        client_id: config.client_id,
        // client_secret：通过注册应用程序生成的客户端密钥。
        client_secret: config.client_secret,
        // code：在前一步骤中获得的授权码。
        code,
        // redirect_uri：此值必须与授权代码请求中使用的值相同。
        redirect_uri: config.redirect_uri,
        // grant_type：应用程序使用的授权类型。对于授权授权流程，应始终如此authorization_code
        grant_type: config.grant_type,
      };


      const paramsTemp = new URLSearchParams();

      Object.keys(params).map((key) => {
        paramsTemp.append(key, params[key]);
      });

      // 这些参数被编码为application/x-www-form-urlencoded内容类型并发送到令牌请求URL。
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: paramsTemp,
      };

      console.log('paramsTemp');
      console.log(paramsTemp);


      const data = await fetch(url, {}, options);

      console.log('data');
      console.log(data);
      return;
      // 获取用户信息
      const userinfo = await fetch(`https://api.config.com/user?access_token=${accessToken}`);

      // 从数据库查找对应用户第三方登录信息
      let oauth = await Oauth.findOne({ from: 'config', 'data.login': userinfo.login });

      if (!oauth) {
        console.log('新用户注册2');
        // 如果不存在则创建新用户，并保存该用户的第三方登录信息
        const { avatar_url, name } = userinfo;

        // 将用户头像上传至七牛
        const avatarUrl = await fetchToQiniu(avatar_url);
        console.log('avatarUrl');
        console.log(avatarUrl);
        const user = await User.create({ avatarUrl, nickname: name });
        // await client.setAsync(user._id, user);
        oauth = await Oauth.create({ from: 'config', data: userinfo, user });
      }
      // 生成token（用户身份令牌）
      const token = await getUserToken(oauth.user);
      // 重定向页面到用户登录页，并返回token
      ctx.redirect(`${DOMAIN}/oauth?token=${token}`);
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  }
}

export default new OauthClass();
