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
    startOfHour: Number!
    endOfHour: Number!
    timeRange: Number!
    multi: Boolean,
    # 允许多名访客同时会面吗
    times: Array!
    createdAt: String!
    _id: String!
  }
  input TimetableInput {
    title: String!
    description: String!
    startOfDay: String!
    endOfDay: String!
    startOfHour: Number!
    endOfHour: Number!
    timeRange: Number!
    multi: Boolean,
    # 允许多名访客同时会面吗
    times: [Number!]
  }
`;
