
import { Book, User, Timetable } from '../../../mongo/modals';
import { userLoader, timetableLoader } from '../../utils';
import { throwError } from '../../utils/error';
import { sentOutlookEmail } from '../../../utils/outlook';


/* eslint-disable camelcase */
/* eslint-disable array-callback-return */

export default {
  Mutation: {
    createBook: async (root, args, ctx, op) => {
      console.log('createBook');

      const { user } = ctx;
      // console.log('user');
      // console.log(user);

      const userInfo = await User.findById(user);
      // console.log('userInfo');
      // console.log(userInfo);


      // throwError({ message: '尚未登录！', data: { status: 403 } });
      if (!user) {
        throwError({ message: '尚未登录！', data: { status: 403 } });
      }
      const { input } = args;
      // console.log('createBook input');
      // console.log(input);

      const timetable = await Timetable.findById(input.timetable);
      // console.log('timetable');
      // console.log(timetable);

      // 查找当前活动已被预订的数据
      const bookList = await Book.find({ timetable: input.timetable });

      const times = JSON.parse(input.times);
      Object.keys(times).map((key) => {
        bookList.map((boo) => {
          const timetable_times = JSON.parse(boo.times);

          // 看其他人都选了那些时间段
          const timetable_selected = timetable_times[key] || [];
          const book_selected = times[key];

          book_selected.map((i) => {
            console.log('timetable_selected.findIndex((i - 1) !== -1)');
            // 检测所选的时间点前面两个时间点是否已被选中
            if ((timetable_selected.indexOf(i - 1) !== -1)
              && (timetable_selected.indexOf(i - 2) !== -1)
            ) {
              // 如果条件全部符合，抛出异常
              throwError({ message: `${key}的预订人数过多，请选择其他日期！`, data: { status: 201 } });
            }
          });
        });
      });

      const data = await Book.create({ ...input, user });

      // 给预订者发邮件
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
              address: input.email || userInfo.username,
            },
          },
        ],
      });

      const timetableUserInfo = await User.findById(timetable.user);
      console.log('timetableUserInfo');
      console.log(timetableUserInfo);

      // 给活动发布者发邮件
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
              address: timetable.email || timetableUserInfo.username,
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
