import { common } from '../utils';
// import article from './article';
import timetable from './timetable';
import book from './book';
// import comment from './comment';
// import thumb from './thumb';
import oauth from './oauth';
import user from './user';

export const userSchema = { ...common, ...user };
export const oauthSchema = { ...common, ...oauth };
// export const articleSchema = { ...common, ...article };
// export const commentSchema = { ...common, ...comment };
export const timetableSchema = { ...common, ...timetable };
export const bookSchema = { ...common, ...book };
// export const thumbSchema = { ...common, ...thumb };

// import fs from 'fs';
// import common from '../utils';

// const schemas = {};

// fs.readdirSync(__dirname)
//   .filter(value => value !== 'index.js')
//   .map((value) => {
//     const key = `${value.replace('.js', '')}Schema`;
//     schemas[key] = { ...common, ...require(`./${value}`).default };
//   });

// export default schemas;
