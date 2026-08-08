export const register = async (req, res) => {
  const { username, email, password } = req.body;

  console.log(username, email, password);

  res.json({
    success: true,
    message: "User registered successfully",
  });
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  res.json({
    success: true,
    message: "Login successful",
  });
};