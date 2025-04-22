import jwt from "jsonwebtoken";

const genAuthToken = async (userID, res) => {
  try {
    const token = jwt.sign({ key: userID }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    });
    return token;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default genAuthToken;
