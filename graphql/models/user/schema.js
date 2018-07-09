export default `
  type User {
    _id: String!
    username: String!
    nickname: String
    avatarUrl: String
  }
  type UserLogin {
    status: Int!
    token: String
    message: String
    userInfo: User
  }
  input CreateUserInput {
    username: String!
    password: String!
  }
`;
