
import { Timetable } from '../../../mongo/modals';
import { userLoader } from '../../utils';
import { throwError } from '../../utils/error';

export default {
  Mutation: {
    createTimetable: async (root, args, ctx, op) => {
      console.log('createTimetable');
      const { user } = ctx;
      console.log('user');
      console.log(user);

      // throwError({ message: '尚未登录！', data: { status: 403 } });
      if (!user) {
        throwError({ message: '尚未登录！', data: { status: 403 } });
      }
      const { input } = args;
      console.log('createTimetable input');
      console.log(input);
      const say = await Timetable.create({ ...input, user });
      return say;
    },

  },
  Query: {
    timetable: async (root, args) => {
      const { _id } = args;
      const data = await Timetable.findById(_id);
      console.log('data');
      console.log(data);
      return data;
    },
    timetables: async (root, args) => {
      try {
        const { skip = 0, first = 10, sort = '-createdAt' } = args;
        const data = await Timetable
          .find({})
          .skip(skip)
          .limit(first)
          .sort(sort);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    _timetablesMeta: async (root, args) => {
      try {
        const data = await Timetable.count();
        return { count: data };
      } catch (error) {
        console.log(error);
      }
    },
  },
  Timetable: {
    user: ({ user }) => userLoader.load(user),
  },
};
