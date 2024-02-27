import mongoose from "mongoose";

const linkSchema = mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    fullUrl: {
      type: String,
      required: true,
      trim: true,
    },
    visitHistory: [
      {
        timestamp: { type: Number },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export const Link = mongoose.model("Link", linkSchema);
// mongoose will look for db collection name 'links' as moogose pluralize
// and lowercase the collection name by default
