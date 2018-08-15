
import { Timetable, User } from '../../../mongo/modals';
import { userLoader } from '../../utils';
import { throwError } from '../../utils/error';
import { sentOutlookEmail } from '../../../utils/outlook';

export default {
  Mutation: {
    createTimetable: async (root, args, ctx, op) => {
      console.log('createTimetable');
      const { user } = ctx;
      console.log('user');
      console.log(user);

      const userInfo = await User.findById(user);

      console.log('userInfo');
      console.log(userInfo);

      // throwError({ message: '尚未登录！', data: { status: 403 } });
      if (!user) {
        throwError({ message: '尚未登录！', data: { status: 403 } });
      }
      const { input } = args;
      console.log('createTimetable input');
      console.log(input);
      const data = await Timetable.create({ ...input, user });

      const params = {
        subject: `【活动创建成功！】${data.title}`,
        importance: 'Low',
        body: {
          contentType: 'HTML',
          content: `<h1>【活动创建成功！】${data.title}</h1><br/><p>${data.description}</p><br/><p>请点击以下链接前往：</p><p><a href="http://localhost:8000/timetable/detail?_id=${data._id}">http://localhost:8000/timetable/detail?_id=${data._id}</a></p>`,
        },
        toRecipients: [
          {
            emailAddress: {
              address: userInfo.username,
            },
          },
        ],
      };
      await sentOutlookEmail(user, params);
      return data;
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
