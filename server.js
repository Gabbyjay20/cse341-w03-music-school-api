const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerDocument = require("./swagger.json");

const { initDb } = require("./db/connect");

const studentsRoutes = require("./routes/students");
const lessonsRoutes = require("./routes/lessons");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use("/students", studentsRoutes);
app.use("/lessons", lessonsRoutes);

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });