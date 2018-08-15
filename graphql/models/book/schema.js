export default `
  type BookMeta {
    count: Int!
  }
  type Book {
    description: String!
    user: User!
    timetable: Timetable!
    firstName: String!
    lastName: String!
    studentId: String!
    times: String!
    createdAt: String!
    email: String!
    _id: String!
  }
  input BookInput {
    description: String!
    firstName: String!
    lastName: String!
    studentId: String!
    times: String!
    timetable: String!
    email: String!
  }
`;
