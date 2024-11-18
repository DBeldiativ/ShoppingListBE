const checkRole = (requiredRoles) => (req, res, next) => {
  const userRole = req.headers["role"]; // Simulace role z hlavičky požadavku

  // Pokud je očekávána pouze jedna role, převedeme ji na pole pro snadnější kontrolu
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }

  // Ověřujeme, zda role uživatele je v seznamu požadovaných rolí
  if (!requiredRoles.includes(userRole)) {
    return res.status(403).json({
      uuAppErrorMap: { authorizationError: "Přístup odepřen" },
    });
  }

  next(); // Pokud je role platná, pokračujeme na další middleware nebo endpoint
};

module.exports = checkRole;

  