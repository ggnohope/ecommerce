import mongoose from "mongoose";

const { Schema, model } = mongoose;

const DOCUMENT_NAME = "refreshToken";
const COLLECTION_NAME = "refreshTokens";

var refreshTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "shop",
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model(DOCUMENT_NAME, refreshTokenSchema);
