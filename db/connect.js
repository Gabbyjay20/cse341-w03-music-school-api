const { MongoClient } = require("mongodb");
require("dotenv").config();

let database;

const initDb = async () => {
  if (database) {
    return database;
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  await client.connect();

  database = client.db("w03_music_school");

  console.log("Connected to MongoDB");

  return database;
};

const getDatabase = () => {
  return database;
};

module.exports = {
  initDb,
  getDatabase
};