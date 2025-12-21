import express from "express";
import { signup, login, logout } from "../firebase/auth.service.js";
import admin from "../firebaseAdmin.js";

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await signup(email, password);

    res.status(201).json({
      success: true,
      message: "User created successfully. Please verify your email.",
      user: {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    let message = "Failed to create user";
    
    if (error.code === "auth/email-already-in-use") {
      message = "Email is already registered";
    } else if (error.code === "auth/invalid-email") {
      message = "Invalid email address";
    } else if (error.code === "auth/weak-password") {
      message = "Password is too weak";
    }

    res.status(400).json({
      success: false,
      message,
      error: error.code || error.message,
    });
  }
});

// Login route - requires email verification
router.post("/login", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "ID token is required",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken.email_verified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please verify your email before logging in.",
        emailVerified: false,
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    let message = "Failed to login";

    if (error.code === "auth/id-token-expired") {
      message = "Token expired. Please login again.";
    } else if (error.code === "auth/id-token-revoked") {
      message = "Token revoked. Please login again.";
    } else if (error.code === "auth/argument-error") {
      message = "Invalid token format";
    }

    res.status(401).json({
      success: false,
      message,
      error: error.code || error.message,
    });
  }
});


router.post("/check-verification", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "ID token is required",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    const userRecord = await admin.auth().getUser(decodedToken.uid);

    res.status(200).json({
      success: true,
      emailVerified: userRecord.emailVerified,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
      },
    });
  } catch (error) {
    console.error("Verification check error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
      error: error.message,
    });
  }
});

// Logout route
router.post("/logout", async (req, res) => {
  try {
    await logout();
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to logout",
      error: error.message,
    });
  }
});

export default router;

