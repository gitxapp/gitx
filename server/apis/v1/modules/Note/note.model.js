import mongoose from 'mongoose';

const { Schema } = mongoose;

const noteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    projectName: {
      type: String,
      required: true,
    },
    noteType: String, // pull or issue
    issueId: {
      type: String,
      required: true,
    }, // issue or pull id
    noteContent: String,
    nearestCommentId: String,
    nearestCreatedDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

noteSchema.post('save', (doc, next) => {
  doc
    .populate('userId', 'userName avatarUrl githubId')
    .execPopulate()
    .then(() => {
      next();
    });
});

export default mongoose.model('Note', noteSchema);
