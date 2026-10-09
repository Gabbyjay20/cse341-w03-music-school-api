const { ObjectId } = require("mongodb");
const { getDatabase } = require("../db/connect");
const fields = ["firstName", "lastName", "email", "phone", "instrument", "specialty"];
const collectionName = "teachers";
function validBody(body) {
  return fields.every((field) => typeof body[field] === "string" && body[field].trim().length > 0);
}
const getAllTeachers = async (req, res) => {
  try { const db = getDatabase(); const items = await db.collection(collectionName).find().toArray(); return res.status(200).json(items); }
  catch (error) { console.error(error); return res.status(500).json({ error: "Failed to retrieve teachers" }); }
};
const getSingleTeacher = async (req, res) => {
  try { const { id } = req.params; if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid teacher id" }); const item = await getDatabase().collection(collectionName).findOne({ _id: new ObjectId(id) }); if (!item) return res.status(404).json({ error: "Teacher not found" }); return res.status(200).json(item); }
  catch (error) { console.error(error); return res.status(500).json({ error: "Failed to retrieve teacher" }); }
};
const createTeacher = async (req, res) => {
  try { if (!validBody(req.body)) return res.status(400).json({ error: `Required fields: ${fields.join(", ")}` }); const item = Object.fromEntries(fields.map((f) => [f, req.body[f].trim()])); const result = await getDatabase().collection(collectionName).insertOne(item); return res.status(201).json({ message: "Teacher created successfully", id: result.insertedId }); }
  catch (error) { console.error(error); return res.status(500).json({ error: "Failed to create teacher" }); }
};
const updateTeacher = async (req, res) => {
  try { const { id } = req.params; if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid teacher id" }); if (!validBody(req.body)) return res.status(400).json({ error: `Required fields: ${fields.join(", ")}` }); const item = Object.fromEntries(fields.map((f) => [f, req.body[f].trim()])); const result = await getDatabase().collection(collectionName).updateOne({ _id: new ObjectId(id) }, { $set: item }); if (!result.matchedCount) return res.status(404).json({ error: "Teacher not found" }); return res.status(204).send(); }
  catch (error) { console.error(error); return res.status(500).json({ error: "Failed to update teacher" }); }
};
const deleteTeacher = async (req, res) => {
  try { const { id } = req.params; if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid teacher id" }); const result = await getDatabase().collection(collectionName).deleteOne({ _id: new ObjectId(id) }); if (!result.deletedCount) return res.status(404).json({ error: "Teacher not found" }); return res.status(204).send(); }
  catch (error) { console.error(error); return res.status(500).json({ error: "Failed to delete teacher" }); }
};
module.exports = { getAllTeachers, getSingleTeacher, createTeacher, updateTeacher, deleteTeacher };
