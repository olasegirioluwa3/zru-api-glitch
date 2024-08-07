import jwt from 'jsonwebtoken';
import RegCenter from "../models/regcenter.js"; // Adjust path based on your project structure

const authRegCenterMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ status: 'failed', message: 'Authorization token not provided!' });
  }

  try {
    jwt.verify(token, process.env.APP_SECRET_KEY, async (error, decodedToken) => {
      if (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
          return res.status(401).send({ status: 'failed', message: 'Invalid or expired token!' });
        }
        return res.status(500).send({ status: 'failed', message: 'Failed to verify token', error: error.message });
      }

      req.tmpuser = {
        id: decodedToken.id,
      };

      try {
        const regCenter = await RegCenter.findById(req.tmpuser.id); // Assuming findById or similar method
        if (!regCenter) {
          throw new Error('RegCenter not found');
        }
        req.tmpuser = null;
        req.user = regCenter;
        req.user.role = "regcenter";
        next(); // Continue to the next middleware or route handler
      } catch (error) {
        console.error(error);
        res.status(401).send({ error: 'Please authenticate.' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'failed', message: 'Failed to verify token', error: error.message });
  }
};

export default authRegCenterMiddleware;
