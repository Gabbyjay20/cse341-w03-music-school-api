const express = require("express");
const router = express.Router();

const lessonsController = require("../controllers/lessons");

router.get("/", lessonsController.getAllLessons);
router.get("/:id", lessonsController.getSingleLesson);
router.post("/", lessonsController.createLesson);
router.put("/:id", lessonsController.updateLesson);
router.delete("/:id", lessonsController.deleteLesson);

module.exports = router;