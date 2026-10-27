import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../Db/Schema/userSchema.js";

/**
 * Authentication middleware for VideoServices.
 * Validates JWT access token issued by the authentication service,
 * verifies user existence and active status against the shared database,
 * and attaches the authenticated user to req.user.
 */
export const verifyJWT = async (req, res, next) => {
  try {
    // 1. Extract token from cookie or Authorization header (supporting Bearer token format)
    const token =
      req.cookies?.accessToken ||
      req.headers["authorization"]?.replace(/^Bearer\s+/i, "") ||
      req.headers["authorisation"]?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    // 2. Verify JWT signature, expiry and format
    const secretKey =
      process.env.DataBase_Secret_Acess_key || "6347319ui3-2prp-ijdi";

    let decodedData;
    try {
      decodedData = jwt.verify(token, secretKey, {
        algorithms: ["HS256"],
      });
    } catch (jwtErr) {
      if (jwtErr.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Access token has expired",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    // 3. Extract and validate user ID from verified token claims
    const userId = decodedData?._id;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid token claims",
      });
    }

    // 4. Resolve user from database (handling DB/infrastructure failures separately from JWT failures)
    let user;
    try {
      user = await User.findById(userId).select("-password -RefreshToken");
    } catch (dbErr) {
      return res.status(500).json({
        success: false,
        message: "Database error during user verification",
      });
    }

    // 5. Account existence check
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or unauthorized",
      });
    }

    // 6. Account validity check: reject inactive users with 403 Forbidden
    if (user.isActive !== undefined && user.isActive !== true) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    // 7. Attach verified user to request
    req.user = user;
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
    });
  }
};
