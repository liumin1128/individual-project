import user from './models/user/schema';
// import article from './models/article/schema';
import timetable from './models/timetable/schema';
import book from './models/book/schema';

export default `
  ${user}
  ${timetable}
  ${book}

  type Query {

    # 用户
    user: User
    users(first: Int, skip: Int): [User]

    # 时间表
    timetable(_id: String): Timetable
    timetables(first: Int, skip: Int): [Timetable]
    _timetablesMeta: TimetableMeta

    # 预订
    book(_id: String): Book
    books(first: Int, skip: Int): [Book]
    _booksMeta: BookMeta!

  }
  type Mutation {

    # 用户登录
    userLogin(username: String!, password: String!): UserLogin

    # 创建时间表
    createTimetable(input: TimetableInput): Timetable

    # 删除时间表
    deleteTimetable(id: String!): Timetable

    # 创建预订
    createBook(input: BookInput): Book

    # 删除预订
    deleteBook(id: String!): Book

    # 创建用户
    createUser(input: CreateUserInput): User

  }
`;
