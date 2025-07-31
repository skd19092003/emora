import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {

    name: string,
    email: string,
    password: string
}
//typescript interface for iuser 
//this means instances of iuser will have the properties of the mongoose document
//this interface ensures type safety for our user objects specifying each user must have name emal pass as string

//new mongoose schema with strong typescript check
const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
},
    { timestamps: true, }
);

export const User = mongoose.model<IUser>("User", UserSchema);
//this line compiles our schema into a mongoose model that can be used to interact with our
//user collection in mongodb databasse 