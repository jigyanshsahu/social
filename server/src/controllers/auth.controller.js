import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // TODO: Validate input and check if user exists in DB
    // TODO: Hash password and save user to DB

    res.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // TODO: Query user from database
    // TODO: Verify password with bcryptjs.compare()
    
    // For now, mock user object (replace with DB query)
    const user = {
      id: "user_123",
      email: email,
      username: "testuser",
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};