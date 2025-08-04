import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage {
    //this is for individual chat messages
  //role can be either user or assistant
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    technique: string;
    goal: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    progress: any[];
  };
}
//this defined the structure of a chat message single inside a chat session

export interface IChatSession extends Document {
    //this is for the entire chat session
  //sessionId is a unique identifier for the chat session
  sessionId: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    technique: String,
    goal: String,
    //array of progress items, can be of any type using mongodb's Mixed type
    progress: [Schema.Types.Mixed],
  },
});

const chatSessionSchema = new Schema<IChatSession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    messages: [chatMessageSchema],
  },
  {
    timestamps: true,
  }
);

export const ChatSession = mongoose.model<IChatSession>("ChatSession", chatSessionSchema);