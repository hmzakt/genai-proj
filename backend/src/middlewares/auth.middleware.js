import admin from "../firebaseAdmin.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken.email_verified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please verify your email before accessing this resource.",
      });
    }

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ 
      success: false,
      message: "Invalid or expired token" 
    });
  }
};

