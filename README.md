
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

名称随意: react.mobi

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






