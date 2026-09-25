const { ObjectId } = require("mongodb");
const { getDatabase } = require("../db/connect");

const getAllLessons = async (req, res) => {
  try {
    const database = getDatabase();

    const lessons = await database
      .collection("lessons")
      .find()
      .toArray();

    res.status(200).json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve lessons"
    });
  }
};

const getSingleLesson = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid lesson id"
      });
    }

    const database = getDatabase();

    const lesson = await database
      .collection("lessons")
      .findOne({
        _id: new ObjectId(id)
      });

    if (!lesson) {
      return res.status(404).json({
        error: "Lesson not found"
      });
    }

    res.status(200).json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve lesson"
    });
  }
};

const createLesson = async (req, res) => {
  try {
    const {
      studentId,
      instrument,
      lessonDate,
      lessonTime,
      duration,
      teacher
    } = req.body;

    if (
      !studentId ||
      !instrument ||
      !lessonDate ||
      !lessonTime ||
      !duration ||
      !teacher
    ) {
      return res.status(400).json({
        error: "All lesson fields are required"
      });
    }

    const database = getDatabase();

    const newLesson = {
      studentId,
      instrument,
      lessonDate,
      lessonTime,
      duration,
      teacher
    };

    const result = await database
      .collection("lessons")
      .insertOne(newLesson);

    res.status(201).json({
      message: "Lesson created successfully",
      id: result.insertedId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create lesson"
    });
  }
};

const updateLesson = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid lesson id"
      });
    }

    const {
      studentId,
      instrument,
      lessonDate,
      lessonTime,
      duration,
      teacher
    } = req.body;

    if (
      !studentId ||
      !instrument ||
      !lessonDate ||
      !lessonTime ||
      !duration ||
      !teacher
    ) {
      return res.status(400).json({
        error: "All lesson fields are required"
      });
    }

    const database = getDatabase();

    const result = await database
      .collection("lessons")
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            studentId,
            instrument,
            lessonDate,
            lessonTime,
            duration,
            teacher
          }
        }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: "Lesson not found"
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to update lesson"
    });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid lesson id"
      });
    }

    const database = getDatabase();

    const result = await database
      .collection("lessons")
      .deleteOne({
        _id: new ObjectId(id)
      });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "Lesson not found"
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to delete lesson"
    });
  }
};

module.exports = {
  getAllLessons,
  getSingleLesson,
  createLesson,
  updateLesson,
  deleteLesson
};