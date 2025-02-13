import mongoose, { Schema } from 'mongoose';
import shortId from 'shortid';

const shorUrlSchema = new Schema({
  username: { type: String, default: 'guest' },
  CreateAt: { type: Date },
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    default: shortId.generate,
  },
  clicks: Number,
});
export default mongoose.model('ShortUrl', shorUrlSchema);
