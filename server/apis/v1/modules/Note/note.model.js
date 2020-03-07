import mongoose from "mongoose";

const { Schema } = mongoose;

const noteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectName: {
      type: String,
      required: true
    },
    noteType: String, // pull or issue
    issueId: {
      type: String,
      required: true
    }, // issue id or pull id
    repoOwner: {
      type: String,
      required: true
    }, // repo owner name
    repoOwnerType: {
      type: String,
      required: true
    }, // user or organization
    noteVisibility: {
      type: Boolean,
      default: false
    },
    noteContent: String,
    nearestCommentId: String,
    nearestCreatedDate: { type: Date },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

noteSchema.post("save", (doc, next) => {
  doc
    .populate("userId", "userName avatarUrl githubId")
    .execPopulate()
    .then(() => {
      next();
    });
});

export default mongoose.model("Note", noteSchema);
