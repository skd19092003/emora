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

const activitySchema = new Schema<IActivity>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Activity = mongoose.model<IActivity>("Activity", activitySchema);
