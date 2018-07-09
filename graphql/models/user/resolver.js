import { User } from '../../../mongo/modals';
import { getUserToken } from '../../../utils/jwt';

export default {
  Mutation: {
    userLogin: async (root, args, ctx, op) => {
      try {
        const { password, ...other } = args;
        const user = await User.findOne(other);
        if (user && `${password}` === user.password) {
          const token = await getUserToken(user._id);
          return {
            status: 200,
            message: '登录成功！',
            token,
            userInfo: user,
          };
        } else {
          return {
            status: 403,
            message: '用户名或密码不正确',
          };
        }
      } catch (error) {
        return {
          status: 403,
          message: '登录失败',
          error,
        };
      }
    },
    createUser: async (root, args, ctx, op) => {
      const { input } = args;
      console.log('input');
      console.log(input);
      const data = await User.create(input);
      return data;
    },
  },
  Query: {
    users: async (root, args) => {
      try {
        const { skip = 0, first = 10, sort = '-createdAt' } = args;
        const data = await User
          .find({})
          .skip(skip)
          .limit(first)
          .sort(sort);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
