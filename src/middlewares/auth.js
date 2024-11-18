const checkRole = (requiredRoles) => (req, res, next) => {
  const userRole = req.headers["role"]; 

  
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }

  
  if (!requiredRoles.includes(userRole)) {
    return res.status(403).json({
      uuAppErrorMap: { authorizationError: "Přístup odepřen" },
    });
  }

  next(); 
};

module.exports = checkRole;

  