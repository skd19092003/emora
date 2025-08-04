import mongoose, { Document, Schema } from "mongoose";

export interface IActivity extends Document {
  //this userid is used to connect activity directly to a speicfic user type
  userId: Schema.Types.ObjectId;
  type: string;
  name: string;
  description: string;
  duration: number; // in seconds
  timestamp: Date;

}

// Interface vs Schema Explanation:
// - The IActivity interface defines the TypeScript TYPE contract for our Activity model
// - It provides compile-time type checking and autocompletion in TypeScript
// - The activitySchema defines the MONGODB SCHEMA structure and validation rules
// - It defines how data is stored in the database (field types, required fields, defaults, etc.)
// - Both are required because:
//   1) Interface works at TypeScript level (development time, type safety)
//   2) Schema works at MongoDB level (runtime, data persistence, validation)
//   3) The generic <IActivity> in Schema<IActivity> connects them for type safety
//for an easy example like this, you can think of the interface as a blueprint for a house (type contract) and the schema as the actual construction plan (database structure). Both are needed to ensure that the house is built correctly and meets all requirements.

const activitySchema = new Schema<IActivity>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // database Index for faster lookups this means that the userId field will be indexed in the database, which improves query performance when searching for activities by userId
  },
  type: {
    type: String,
    required: true,
    enum: [
      "meditation",
      "exercise",
      "walking",
      "reading",
      "journaling",
      "therapy",
    ]
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  duration: {
    type: Number,
    min: 0, // duration cannot be negative
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, 
{
  timestamps: true
}
);

activitySchema.index({ userId: 1, timestamp: -1 });
// This creates a compound index on userId and timestamp for faster queries
//in simple words, this means that when you query activities by userId, it will be faster because the database can quickly find the relevant records using this index
//this will filter by user id and sort the results by timestamp in descending order showing most recent activities firstly

export const Activity = mongoose.model<IActivity>("Activity", activitySchema);
