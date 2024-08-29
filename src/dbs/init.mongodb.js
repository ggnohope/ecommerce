"use strict";

const mongoose = require("mongoose");

const connectString =
  process.env.MONGODB_URI ||
  "mongodb+srv://ggnohope:Ys93gw0QvdFs2qTo@cluster0.w0okv.mongodb.net/sample_mflix";

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    mongoose.set("debug", true);
    mongoose.set("debug", { color: true });

    mongoose
      .connect(connectString)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        console.log("Error connecting to MongoDB", err);
      });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
