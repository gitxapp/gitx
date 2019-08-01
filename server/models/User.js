const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    user_name: { type: String, default: null },
    github_id: { type: String, default: null, unique: true, required: true },
    email_id: { type: String, unique: true, required: true },
    avatar_url: { type: String, default: null },
    company: { type: String, default: null },
    location: { type: String, default: null },
    bio: { type: String, default: null },
    auth_params: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);
mongoose.model('User', userSchema);
