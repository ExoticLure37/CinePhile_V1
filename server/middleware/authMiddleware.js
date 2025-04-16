const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
<<<<<<< HEAD
  try {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
      console.log("No cookie header found.");
      return res
        .status(401)
        .json({ message: "Unauthorized Access", error: true });
    }

    const token = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("token="))
      .split("=")[1];
    console.log("Token from cookie:", token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized Access", error: true });
    }

    const userInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = userInfo; // Attach user data to request
    next();
  } catch (error) {
    console.log("Error verifying token:", error.message);
    return res.status(401).json({ message: "Invalid Token", error: true });
  }
};

module.exports={authUser};
=======
   try {
     const cookieHeader = req.headers.cookie;
 
     if (!cookieHeader) {
      //  console.log("No cookie header found.");
       return res.status(401).json({ message: 'Unauthorized Access', error: true });
     }
 
     const token = cookieHeader.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    //  console.log("Token from cookie:", token);
 
     if (!token) {
       return res.status(401).json({ message: 'Unauthorized Access', error: true });
     }
 
     const userInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
     req.user = userInfo; // Attach user data to request
     next();
   } catch (error) {
    //  console.log("Error verifying token:", error.message);
     return res.status(401).json({ message: 'Invalid Token', error: true });
   }
 };

 module.exports = {authUser} ; 
 
>>>>>>> e9e04a7120f6163fb1b3d2a537865d290a0f1477
