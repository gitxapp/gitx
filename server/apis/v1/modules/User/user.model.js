import mongoose from 'mongoose';

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    userName: { type: String, default: null },
    name: { type: String, default: null },
    githubId: {
      type: String,
      default: null,
      unique: true,
      required: true,
    },
    email: { type: String },
    avatarUrl: { type: String, default: null },
    company: { type: String, default: null },
    location: { type: String, default: null },
    bio: { type: String, default: null },
    authParams: { type: Schema.Types.Mixed },
    accessToken: String,
  },
  { timestamps: true },
);
export default mongoose.model('User', userSchema);
