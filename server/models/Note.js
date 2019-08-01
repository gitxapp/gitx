const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    note_content: String,
    type: String, // pull or issue
    issue_id: String, // issue or pull id
    nearest_comment_id: String,
    nearest_created_date: { type: Date },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

mongoose.model('Note', noteSchema);
