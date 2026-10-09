const { ObjectId } = require("mongodb");
const { getDatabase } = require("../db/connect");
// This collection also stores GitHub OAuth profiles. CRUD routes preserve the OAuth fields.
const fields = ["githubId", "name", "username", "email", "provider"];
function validBody(body) {
  return fields.every((field) => typeof body[field] === "string" && body[field].trim().length > 0);
}
const getAllUsers = async (req, res) => {
  try { const items = await getDatabase().collection("users").find().toArray(); return res.status(200).json(items); }
  catch (error) { console.error(error); return res.status(500).json({ error: "Failed to retrieve users" }); }
};
const getSingleUser = async (req, res) => {
  try { const { id } = req.params; if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid user id" }); const item = await getDatabase().collection("users").findOne({ _id: new ObjectId(id) }); if (!item) return res.status(404).json({ error: "User not found" }); return res.status(200).json(item); }
  catch (error) { console.error(error); return res.status(500).json({ error: "Failed to retrieve user" }); }
};
const createUser = async (req, res) => {
  try { if (!validBody(req.body)) return res.status(400).json({ error: `Required fields: ${fields.join(", ")}` }); const item = Object.fromEntries(fields.map((f) => [f, req.body[f].trim()])); item.createdAt = new Date(); const result = await getDatabase().collection("users").insertOne(item); return res.status(201).json({ message: "User created successfully", id: result.insertedId }); }
  catch (error) { console.error(error); return res.status(500).json({ error: "Failed to create user" }); }
};
const updateUser = async (req, res) => {
  try { const { id } = req.params; if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid user id" }); if (!validBody(req.body)) return res.status(400).json({ error: `Required fields: ${fields.join(", ")}` }); const item = Object.fromEntries(fields.map((f) => [f, req.body[f].trim()])); const result = await getDatabase().collection("users").updateOne({ _id: new ObjectId(id) }, { $set: item }); if (!result.matchedCount) return res.status(404).json({ error: "User not found" }); return res.status(204).send(); }
  catch (error) { console.error(error); return res.status(500).json({ error: "Failed to update user" }); }
};
const deleteUser = async (req, res) => {
  try { const { id } = req.params; if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid user id" }); const result = await getDatabase().collection("users").deleteOne({ _id: new ObjectId(id) }); if (!result.deletedCount) return res.status(404).json({ error: "User not found" }); return res.status(204).send(); }
  catch (error) { console.error(error); return res.status(500).json({ error: "Failed to delete user" }); }
};
module.exports = { getAllUsers, getSingleUser, createUser, updateUser, deleteUser };
