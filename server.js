const express = require("express");
const session = require("express-session");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config();

const swaggerDocument = require("./swagger.json");

const { initDb } = require("./db/connect");

const studentsRoutes = require("./routes/students");
const lessonsRoutes = require("./routes/lessons");
const authRoutes = require("./routes/auth");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  })
);

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Swagger documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Authentication routes
app.use("/auth", authRoutes);

// Existing API routes
app.use("/students", studentsRoutes);
app.use("/lessons", lessonsRoutes);

// Start server after connecting to MongoDB
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });