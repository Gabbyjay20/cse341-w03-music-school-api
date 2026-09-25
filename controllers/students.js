const { ObjectId } = require("mongodb");
const { getDatabase } = require("../db/connect");

// GET ALL STUDENTS
const getAllStudents = async (req, res) => {
  try {
    const database = getDatabase();

    const students = await database
      .collection("students")
      .find()
      .toArray();

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve students"
    });
  }
};

// GET ONE STUDENT
const getSingleStudent = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid student id"
      });
    }

    const database = getDatabase();

    const student = await database
      .collection("students")
      .findOne({
        _id: new ObjectId(id)
      });

    if (!student) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve student"
    });
  }
};

// CREATE STUDENT
const createStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      age,
      instrument,
      level,
      parentName,
      phone
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      age === undefined ||
      !instrument ||
      !level ||
      !parentName ||
      !phone
    ) {
      return res.status(400).json({
        error:
          "firstName, lastName, email, age, instrument, level, parentName, and phone are required"
      });
    }

    const database = getDatabase();

    const newStudent = {
      firstName,
      lastName,
      email,
      age,
      instrument,
      level,
      parentName,
      phone
    };

    const result = await database
      .collection("students")
      .insertOne(newStudent);

    res.status(201).json({
      message: "Student created successfully",
      id: result.insertedId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create student"
    });
  }
};

// UPDATE STUDENT
const updateStudent = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid student id"
      });
    }

    const {
      firstName,
      lastName,
      email,
      age,
      instrument,
      level,
      parentName,
      phone
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      age === undefined ||
      !instrument ||
      !level ||
      !parentName ||
      !phone
    ) {
      return res.status(400).json({
        error:
          "firstName, lastName, email, age, instrument, level, parentName, and phone are required"
      });
    }

    const database = getDatabase();

    const updatedStudent = {
      firstName,
      lastName,
      email,
      age,
      instrument,
      level,
      parentName,
      phone
    };

    const result = await database
      .collection("students")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedStudent }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to update student"
    });
  }
};

// DELETE STUDENT
const deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid student id"
      });
    }

    const database = getDatabase();

    const result = await database
      .collection("students")
      .deleteOne({
        _id: new ObjectId(id)
      });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to delete student"
    });
  }
};

module.exports = {
  getAllStudents,
  getSingleStudent,
  createStudent,
  updateStudent,
  deleteStudent
};