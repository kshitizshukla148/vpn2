import mongoose from 'mongoose'; // Import Mongoose library for MongoDB interactions

// Define a new schema for lectures
const lectureSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },               // Lecture title (required, trimmed)
  description:  { type: String, default: '' },                              // Brief description (optional, defaults to empty)
  videoUrl:     { type: String, required: true },                           // Full YouTube URL (required)
  youtubeId:    { type: String, required: true, index: true },              // Extracted YouTube video ID (required, indexed)
  category:     { type: String, default: '' },                              // Category name (optional, defaults to empty)
  duration:     { type: Number },                                           // Video duration in seconds (optional)
  tags:         { type: [String], default: [] },                            // Array of tag strings (optional, defaults to empty array)
  createdBy:    { type: mongoose.Schema.Types.ObjectId,                     // Reference to User who created
                   ref: 'User',                                            //   - ref: points to 'User' collection
                   required: true }                                        //   - required
}, {
  timestamps: true,    // Automatically add `createdAt` and `updatedAt` fields
  versionKey: false    // Disable the `__v` version key
});

// Compile and export the model named 'Lecture' based on the schema
export const Lecture = mongoose.model('Lecture', lectureSchema);
