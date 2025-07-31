//this model will manage user sessions and authentication

import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  deviceInfo?: string;
  lastActive: Date;
}
//The ISession
//interface defines the shape of a session document in the MongoDB database.
//  It extends the Document interface from Mongoose.


const SessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    deviceInfo: { type: String },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);



// Index for automatic cleanup of expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
//0 line ensures that expired sessions are automatically removed from the database
//when they are past their expiration date

export const Session = mongoose.model<ISession>("Session", SessionSchema);