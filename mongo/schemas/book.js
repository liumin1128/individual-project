import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  user: { type: ObjectId, ref: 'User' },
  firstName: String,
  lastName: String,
  studentId: String,
  times: String,
  description: String,
};
