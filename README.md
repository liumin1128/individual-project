
安装依赖：

```
npm i
```
开发启动：

```
npm run start
```

线上运行：

```
npm run pm2
```

全部依赖包：

```
npm i -D @babel/core @babel/register @babel/runtime @babel/preset-env @babel/preset-stage-0 @babel/plugin-transform-runtime eslint babel-eslint eslint-config-airbnb-base eslint-plugin-import nodemon cross-env

npm i -S koa koa-router koa-bodyparser koa-helmet koa-jwt koa-static jsonwebtoken koa2-cors mongoose lodash node-fetch redis bluebird joi moment qiniu query-string apollo-server-koa dataloader graphql graphql-tools apollo-errors 

```

### 开发准备工作

git
nvm
node

开发工具

数据库 mongo，redis

monogo: https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-4.0.0.tgz

brew install mongo redis

编辑器 vsCode

https://code.visualstudio.com/

api调试器 postman
https://chrome.google.com/webstore/category/extensions?utm_source=infinity
chrome商店中搜索：postman


学习资料：

https://www.imooc.com/learn/75

https://www.imooc.com/learn/197

### 开发日志：

后台对接outlook

#### 文档地址：

https://docs.microsoft.com/en-us/outlook/rest/get-started

#### 注册应用：

https://apps.dev.microsoft.com/#/appList

创建了一个应用

名称随意: mengmengliu.me

类型: Web Api

语言: node.js

之后跳过,进入设置页

记录应用程序 ID
7b2befd1-9c19-4891-9d98-69d9da1c43a0

点击生成随机密钥，非常重要，丢了得补办
vmjzmbMLJ426=pZFAS89=+~

添加平台
web api

得到消息：
api://7b2befd1-9c19-4891-9d98-69d9da1c43a0

许可范围：

api://7b2befd1-9c19-4891-9d98-69d9da1c43a0/access_as_user

其他信息随意编辑

用户权限 暂不设置，有一个User.read即可

其他项暂不设置

参考文档开始码字，略去20分钟

https://docs.microsoft.com/en-us/outlook/rest/get-started

写好登录模块后，将其挂载到oauth/outlook路径下，完整路径为

http://localhost:3101/oauth/outlook

多次测试并未成功，检查文档，问题在于：
redirect_uri：一旦用户同意应用程序，Azure将重定向到的位置。此值必须与注册应用程序时使用的重定向URI的值相对应。

回到应用设置页重新添加平台，新增Web平台
重定向url填：http://localhost:3101/oauth/outlook/callback，点击保存，大功告成

已获取code，带入回调即可完成登录

用code获取access_token,需要编码为application/x-www-form-urlencoded
参考文档：https://github.com/bitinn/node-fetch即可实现


参考了文档：https://docs.microsoft.com/zh-cn/outlook/rest/node-tutorial
获取id_token，使用jwt方法，获取中间部分base64解码，得到部分信息

信息不包含用户信息名等，前往app设置，添加权限需求，修改scope字段为：openid profile User.Read Mail.Read

刷新程序，已获取用户名，邮箱

写好登录逻辑，用户信息存入用户表，oauth信息存入oauth表，将token返回给前端，至此登录部分完

### 发送邮件

1.发送个活动的发布者
2.发送给活动的订阅者

参考文档：https://developer.microsoft.com/zh-cn/graph/docs/api-reference/v1.0/resources/message

根据文档要求，发送邮件需要先创建邮件，再进行发送。
创建邮件需要Mail.ReadWrite权限，先去app中申请权限，再到config/outlook中配置。
发送邮件需要Mail.Send权限，先去app中申请权限，再到config/outlook中配置。

创建邮件，需根据文档要求，构建https请求如下：

```
  const url = 'https://graph.microsoft.com/v1.0/me/messages';
  const params = {
    subject: "Did you see last night's game?",
    importance: 'Low',
    body: {
      contentType: 'HTML',
      content: 'They were <b>awesome</b>!',
    },
    toRecipients: [
      {
        emailAddress: {
          address: '970568830@qq.com',
        },
      },
    ],
  };
  ...
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  ...
```

传递正确参数后即可得到邮件草稿创建成功的反馈。

发送邮件需将上一步反馈中的草稿id作为参数，构造新的http请求，如下：

```
const data2 = await sentOutlookEmail('5b73ab77c8476f10abb5401f', params);

headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
},
```

提交正确参数，即可完成邮件创建与发送流程。

需注意的是：这个请求的反馈不是json格式，需解析为text类型。

将方法抽象为公共函数，传入用户id和邮件参数，即可实现任意用户对其他任意用户发送邮件的需求。


### https证书配置

acme.sh --issue -d mengmengliu.me -d www.mengmengliu.me -d api.mengmengliu.me --nginx

acme.sh --installcert  -d  mengmengliu.me   \
        --key-file   /etc/nginx/ssl/mengmengliu.me.key \
        --fullchain-file /etc/nginx/ssl/fullchain.cer \
        --reloadcmd  "service nginx force-reload"


server {
    listen 80;
    server_name mengmengliu.me www.mengmengliu.me api.mengmengliu.me;
    location / {
        rewrite ^(.*)$ https://$host$1 last;
    }
}
server {
    listen 443 ssl http2;
    server_name www.mengmengliu.me, mengmengliu.me;
   
    location / {
        proxy_pass http://127.0.0.1:8000;
    }

    ssl on;
    ssl_certificate /etc/nginx/ssl/fullchain.cer;
    ssl_certificate_key /etc/nginx/ssl/mengmengliu.me.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA;
    ssl_session_cache shared:SSL:50m;
    # ssl_dhparam /var/www/challenges/server.dhparam;
    ssl_prefer_server_ciphers on;
}
server {
    listen 443 ssl http2;
    server_name api.mengmengliu.me;
   
    location / {
        proxy_pass http://127.0.0.1:3101;
    }

    ssl on;
    ssl_certificate /etc/nginx/ssl/fullchain.cer;
    ssl_certificate_key /etc/nginx/ssl/mengmengliu.me.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA;
    ssl_session_cache shared:SSL:50m;
    # ssl_dhparam /var/www/challenges/server.dhparam;
    ssl_prefer_server_ciphers on;
}
