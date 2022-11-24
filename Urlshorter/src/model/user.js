import mongoose, { Schema } from 'mongoose';
import shortId from 'shortid';

const UserSchema = new Schema({
  username: String,
  password: String,
});
export default mongoose.model('User', UserSchema);
