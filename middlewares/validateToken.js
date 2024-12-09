import jwt from 'jsonwebtoken';

export const validateToken = async (req, res, next) => {
  try {
    const JWT_KEY = process.env.JWT_SECRET;

     const  accessToken = req.cookies.accessToken;
    if (accessToken) {
      jwt.verify(accessToken, JWT_KEY, (err, data) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Access to the requested resource is forbidden." });
        } else {
          req.user = data.user;
          return next();
        }
      });
    } else {
        return res
        .status(403)
        .json({ message: "Invalid access token, please log in again" });

    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
