import mongoose, { Schema, Document, models, model, Types } from "mongoose";

export interface ILink extends Document {
  user: Types.ObjectId; // creator's Mongo ObjectId (ref User)
  videoUrl?: string | null; // link to a video service (validation/enum can be added later)
    thumbUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  clientName?: string | null;
  linkMessage?: string | null;
}

const LinkSchema = new Schema<ILink>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    videoUrl: { type: String },
    thumbUrl: { type: String },
    clientName: { type: String },
    linkMessage: { type: String },
  },
  { timestamps: true }
);

export default (models.Link as mongoose.Model<ILink>) || model<ILink>("Link", LinkSchema);
