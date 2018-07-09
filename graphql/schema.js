import user from './models/user/schema';
import article from './models/article/schema';

export default `
  ${user}
  ${article}

  type Query {

    # 用户
    user: User!
    users(first: Int, skip: Int): [User!]

    # 文章
    article(_id: String): Article!
    articles(first: Int, skip: Int): [Article!]
    _articlesMeta: ArticleMeta!
 
  }
  type Mutation {

    # 用户登录
    userLogin(username: String!, password: String!): UserLogin

    # 创建文章
    createArticle(input: ArticleInput): Article!

    # 创建用户
    createUser(input: CreateUserInput): User

  }
`;
