import mongoose,{Document,Schema} from "mongoose";

export interface IMood extends Document {
    userId: Schema.Types.ObjectId;
    score: number,
    note?: string,
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;   
}

const moodSchema = new Schema<IMood>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true, min:0, max:100 },
    note: { type: String, trim:true },
    timestamp: { type: Date, default: Date.now },
}, {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
});

moodSchema.index({userId:1, timestamp:-1});
//this will create an index on userId and timestamp
//this will help to quickly find the latest mood entry for a user
const Mood = mongoose.model<IMood>("Mood", moodSchema);
// Mood model is used to interact with the moods collection in the database
// It allows us to create, read, update, and delete mood entries for users

export { Mood };