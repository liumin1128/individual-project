import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  title: String,
  description: String,
  cover: String,
  user: { type: ObjectId, ref: 'User' },

  startOfDay: String, // Start date can be reserved
  endOfDay: String, // The end date can be reserved
  startOfHour: Number, // What time does it start?
  endOfHour: Number, // When does the time end?
  timeRange: Number, // Time slice
  multi: Boolean, // Are multiple visitors allowed to meet at the same time？

  times: String, // Available time point
  email: String,

};
