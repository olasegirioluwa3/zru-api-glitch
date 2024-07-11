import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ status: "failed", message: 'Authorization token not provided!' });
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
        role: 'admin',
      };

      try {
        const admin = await Admin.findById({ _id: req.tmpuser.id, accountStatus: "active" });
        req.tmpuser = null;
        if (!admin) {
          throw new Error('Admin not found');
        }
        req.user = admin;
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

export default authenticateToken;
