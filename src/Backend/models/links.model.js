import mongoose from 'mongoose';

const linkSchema = mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  visitHistory: [
    {
      timestamp: { type: Number }
    }
  ]
}, { timestamps: true});

export const Link = mongoose.model("Link", linkSchema);
// mongoose will look for db collection name 'links' as moogose pluralize
// and lowercase the collection name by default
