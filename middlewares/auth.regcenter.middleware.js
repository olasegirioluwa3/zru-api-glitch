import jwt from 'jsonwebtoken';
import db from '../models/index.js';
const sequelize = db.sequelize;
const RegCenter = sequelize.models.regcenter;

const authRegCenterMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ status: "failed", message: 'Authorization token not provided!' });
  }

  try {
    jwt.verify(token, process.env.APP_SECRET_KEY, (error, decodedToken) => {
      if (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
          return res.status(401).send({ status: "failed", message: 'Invalid or expired token!' });
        }
        return res.status(500).send({ status: "failed", message: 'Failed to verify token', error: error.message });
      }

      req.tmpuser = {
        id: decodedToken.id,
        role: 'regcenter',
      };
    });
    const regCenter = await RegCenter.findOne({ where: { id: req.tmpuser.id } });
    if (!regCenter) {
      throw new Error();
    }
    req.tmpuser = null;
    req.regcenter = regCenter;
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export default authRegCenterMiddleware;