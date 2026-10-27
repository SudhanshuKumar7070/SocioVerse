/**
 * Authorization middleware for VideoServices.
 * Ensures user has required role(s) to access a resource.
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (roles.length > 0) {
      const userRole = req.user.role || "user";
      if (!roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: insufficient permissions",
        });
      }
    }

    return next();
  };
};
