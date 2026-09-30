const express = require("express");
const passport = require("passport");

const router = express.Router();

const lessonsController = require("../controllers/lessons");

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

// GET all lessons
router.get("/", requireAuth, lessonsController.getAllLessons);

// GET one lesson
router.get("/:id", requireAuth, lessonsController.getSingleLesson);

// POST a lesson
router.post("/", requireAuth, lessonsController.createLesson);

// PUT a lesson
router.put("/:id", requireAuth, lessonsController.updateLesson);

// DELETE a lesson
router.delete("/:id", requireAuth, lessonsController.deleteLesson);

module.exports = router;