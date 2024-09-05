"use strict";

const mongoose = require("mongoose");

const connectString = process.env.MONGODB_URI;

class Database {
  static instance: Database;

  constructor() {
    this.connect();
  }

  connect() {
    mongoose.set("debug", true);
    mongoose.set("debug", { color: true });

    mongoose
      .connect(connectString)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error: Error) => {
        console.log("Error connecting to MongoDB", error);
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
