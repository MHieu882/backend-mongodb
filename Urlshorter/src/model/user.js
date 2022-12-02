import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String,
    required: true },
  password: { type: String,
    required: true },
  active: { type: String,
    default: 'active' },
  role: { type: String, default: 'user' },
  email: { type: String}
});

export default mongoose.model('User', UserSchema);
