import mongoose from "mongoose";

const { Schema, model } = mongoose;

const DOCUMENT_NAME = "blacklistToken";
const COLLECTION_NAME = "blacklistTokens";

const blacklistTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true, // The token to blacklist (can be access or refresh token)
    },
    blacklistedAt: {
      type: Date,
      default: Date.now, // Time when the token was blacklisted
    },
    expiresAt: {
      type: Date, // Expiration time for the blacklisted token (optional)
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    collection: COLLECTION_NAME, // Name of the collection in MongoDB
  }
);

// Optional: Set up TTL (Time To Live) index for automatic deletion of expired tokens
blacklistTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model(DOCUMENT_NAME, blacklistTokenSchema);
