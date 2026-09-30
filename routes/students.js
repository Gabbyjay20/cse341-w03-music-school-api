const express = require("express");
const passport = require("passport");

const router = express.Router();

const studentsController = require("../controllers/students");

// Require the user to be authenticated
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    message: "Authentication required. Please log in with GitHub.",
  });
};

// Make sure Passport checks the existing session
router.use(passport.session());

// GET all students
router.get("/", requireAuth, studentsController.getAllStudents);

// GET one student
router.get("/:id", requireAuth, studentsController.getSingleStudent);

// POST a student
router.post("/", requireAuth, studentsController.createStudent);

// PUT a student
router.put("/:id", requireAuth, studentsController.updateStudent);

// DELETE a student
router.delete("/:id", requireAuth, studentsController.deleteStudent);

module.exports = router;