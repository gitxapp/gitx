import { mongoose } from 'mongoose';

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    userName: { type: String, default: null },
    githubId: {
      type: String,
      default: null,
      unique: true,
      required: true,
    },
    emailId: { type: String, unique: true, required: true },
    avatarUrl: { type: String, default: null },
    company: { type: String, default: null },
    location: { type: String, default: null },
    bio: { type: String, default: null },
    authParams: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);
export default mongoose.model('User', userSchema);
