const express = require("express");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

const { getDatabase } = require("../db/connect");

const router = express.Router();

// Configure GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = getDatabase();

        if (!db) {
          return done(new Error("Database is not connected."));
        }

        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({
          githubId: profile.id,
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = {
          githubId: profile.id,
          name: profile.displayName || profile.username,
          username: profile.username,
          email:
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : null,
          provider: "github",
          createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);

        newUser._id = result.insertedId;

        return done(null, newUser);
      } catch (error) {
        console.error("GitHub authentication error:", error);
        return done(error);
      }
    }
  )
);

// Store the authenticated user in the session
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

// Retrieve the authenticated user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const db = getDatabase();

    if (!db) {
      return done(new Error("Database is not connected."));
    }

    const usersCollection = db.collection("users");

    const { ObjectId } = require("mongodb");

    const user = await usersCollection.findOne({
      _id: new ObjectId(id),
    });

    done(null, user);
  } catch (error) {
    console.error("Deserialize user error:", error);
    done(error);
  }
});

// Start GitHub login
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

// GitHub OAuth callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/login-failed",
  }),
  (req, res) => {
    res.redirect("/auth/profile");
  }
);

// Login failed
router.get("/login-failed", (req, res) => {
  res.status(401).json({
    message: "GitHub authentication failed.",
  });
});

// View logged-in user's profile
router.get("/profile", (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: "You must be logged in to view your profile.",
      });
    }

    res.status(200).json({
      message: "Authentication successful.",
      user: req.user,
    });
  } catch (error) {
    console.error("Profile error:", error);

    res.status(500).json({
      message: "Unable to retrieve profile.",
    });
  }
});

// Logout
router.get("/logout", (req, res, next) => {
  try {
    req.logout((error) => {
      if (error) {
        return next(error);
      }

      req.session.destroy((sessionError) => {
        if (sessionError) {
          return res.status(500).json({
            message: "Unable to log out.",
          });
        }

        res.status(200).json({
          message: "Successfully logged out.",
        });
      });
    });
  } catch (error) {
    console.error("Logout error:", error);

    res.status(500).json({
      message: "Unable to log out.",
    });
  }
});

module.exports = router;