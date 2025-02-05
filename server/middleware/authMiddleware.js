const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
  try {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized Access', error: true });
    }

    const token = cookieHeader.split('; ').find(row => row.startsWith('token=')).split('=')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized Access', error: true });
    }


    const userInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    req.user = userInfo; 
    
    next();

  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token', error: true });
  }
};

module.exports = { authUser };