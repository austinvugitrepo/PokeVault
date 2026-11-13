function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Please sign in to access this resource.",
    });
  }

  next();
}

module.exports = requireAuth;