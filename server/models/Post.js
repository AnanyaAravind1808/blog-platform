const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [10, 'Content must be at least 10 characters long'],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: [
        'Technology',
        'Programming',
        'Web Development',
        'Education',
        'Career',
        'Other',
      ],
      default: 'Technology',
    },

    tags: {
      type: [String],
      default: [],
      set: (tags) =>
        Array.isArray(tags)
          ? tags
              .map((tag) => tag.trim().toLowerCase())
              .filter(Boolean)
          : [],
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);