export default `
  type TimetableMeta {
    count: Int!
  }
  type Timetable {
    title: String!
    description: String!
    cover: String
    user: User!
    startOfDay: String!
    endOfDay: String!
    startOfHour: Int!
    endOfHour: Int!
    timeRange: Int!
    multi: Boolean,
    # 允许多名访客同时会面吗
    times: [Int!]
    createdAt: String!
    _id: String!
  }
  input TimetableInput {
    title: String!
    description: String!
    startOfDay: String!
    endOfDay: String!
    startOfHour: Int!
    endOfHour: Int!
    timeRange: Int!
    multi: Boolean,
    # 允许多名访客同时会面吗
    times: [Int!]
  }
`;
