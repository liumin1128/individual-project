import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  title: String,
  description: String,
  cover: String,
  user: { type: ObjectId, ref: 'User' },

  startOfDay: String, // 计划开始日期
  endOfDay: String, // 计划结束日期
  startOfHour: Number, // 每日最早几点
  endOfHour: Number, // 每日最晚几点
  timeRange: Number, // 时间片段
  multi: Boolean, // 允许多名访客同时会面吗

  times: Array, // 可用时间点

};
