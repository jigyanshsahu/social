import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Example: Get current user profile
 * This route is protected - requires valid JWT token
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // User info is available from req.user (set by verifyToken middleware)
    const userId = req.user.id;
    const userEmail = req.user.email;

    // TODO: Query user data from database
    // const user = await User.findById(userId);

    res.json({
      success: true,
      user: {
        id: userId,
        email: userEmail,
        username: "testuser", // TODO: Get from database
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});

/**
 * Example: Update user profile
 * This route is protected - requires valid JWT token
 */
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, bio } = req.body;

    // TODO: Update user in database
    // const updatedUser = await User.findByIdAndUpdate(userId, { username, bio });

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: userId,
        username: username,
        bio: bio,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
});

/**
 * Example: Get user settings (private)
 * This route is protected - only the user can access their own data
 */
router.get("/settings", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // TODO: Query user settings from database
    // const settings = await UserSettings.findOne({ userId });

    res.json({
      success: true,
      settings: {
        emailNotifications: true,
        privateProfile: false,
        darkMode: false,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
});

export default router;
