import mongoose from "mongoose";

const { Schema, model } = mongoose;

const DOCUMENT_NAME = "apiKey";
const COLLECTION_NAME = "apiKeys";

var apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["READ", "WRITE", "DELETE"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model(DOCUMENT_NAME, apiKeySchema);
