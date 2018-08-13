
import { Book } from '../../../mongo/modals';
import { userLoader } from '../../utils';
import { throwError } from '../../utils/error';

export default {
  Mutation: {
    createBook: async (root, args, ctx, op) => {
      console.log('createBook');
      const { user } = ctx;
      console.log('user');
      console.log(user);

      // throwError({ message: '尚未登录！', data: { status: 403 } });
      if (!user) {
        throwError({ message: '尚未登录！', data: { status: 403 } });
      }
      const { input } = args;
      console.log('createBook input');
      console.log(input);
      const say = await Book.create({ ...input, user });
      return say;
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
  },
};
