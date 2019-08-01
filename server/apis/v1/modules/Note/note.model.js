import mongoose from 'mongoose';

const { Schema } = mongoose;

const noteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    noteContent: String,
    noteType: String, // pull or issue
    issueId: {
      type: String,
      required: true,
    }, // issue or pull id
    nearestCommentId: String,
    nearestCreatedDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model('Note', noteSchema);
