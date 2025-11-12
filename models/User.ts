import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string | null;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  deleted?: boolean;
  linkMessage?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, index: true },
    firstName: { type: String },
    lastName: { type: String },
    imageUrl: { type: String },
    deleted: { type: Boolean, default: false },
    linkMessage: { type: String },
  },
  { timestamps: true }
);


export default (models.User as mongoose.Model<IUser>) || model<IUser>("User", UserSchema);
