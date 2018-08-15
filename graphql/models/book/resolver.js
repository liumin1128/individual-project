
import { Book, User, Timetable } from '../../../mongo/modals';
import { userLoader, timetableLoader } from '../../utils';
import { throwError } from '../../utils/error';
import { sentOutlookEmail } from '../../../utils/outlook';

export default {
  Mutation: {
    createBook: async (root, args, ctx, op) => {
      console.log('createBook');
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
      console.log('createBook input');
      console.log(input);

      const timetable = await Timetable.findById(input.timetable);
      console.log('timetable');
      console.log(timetable);

      const data = await Book.create({ ...input, user });

      await sentOutlookEmail(user, {
        subject: `【活动预订成功！】${timetable.title}`,
        importance: 'Low',
        body: {
          contentType: 'HTML',
          content: `<h1>【活动预订成功！】${timetable.title}</h1><br/><p>${data.description}</p><br/><p>请点击以下链接前往：</p><p><a href="http://localhost:8000/timetable/detail?_id=${data._id}">http://localhost:8000/timetable/detail?_id=${data._id}</a></p>`,
        },
        toRecipients: [
          {
            emailAddress: {
              address: userInfo.username,
            },
          },
        ],
      });

      const timetableUserInfo = User.findById(timetable.user);

      await sentOutlookEmail(timetable.user, {
        subject: `【活动被预订】${timetable.title}`,
        importance: 'Low',
        body: {
          contentType: 'HTML',
          content: `<h1>【活动被预订】${timetable.title}</h1><br/><p>${data.description}</p><br/><p>请点击以下链接前往：</p><p><a href="http://localhost:8000/timetable/detail?_id=${data._id}">http://localhost:8000/timetable/detail?_id=${data._id}</a></p>`,
        },
        toRecipients: [
          {
            emailAddress: {
              address: timetableUserInfo.username,
            },
          },
        ],
      });

      return data;
    },

  },
  Query: {
    book: async (root, args) => {
      const { _id } = args;
      const data = await Book.findById(_id);
      console.log('data');
      console.log(data);
      return data;
    },
    books: async (root, args) => {
      try {
        const { skip = 0, first = 10, sort = '-createdAt' } = args;
        const data = await Book
          .find({})
          .skip(skip)
          .limit(first)
          .sort(sort);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    _booksMeta: async (root, args) => {
      try {
        const data = await Book.count();
        return { count: data };
      } catch (error) {
        console.log(error);
      }
    },
  },
  Book: {
    user: ({ user }) => userLoader.load(user),
    timetable: ({ timetable }) => timetableLoader.load(timetable),
  },
};
