const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: { code: 'UNAUTHENTICATED', message: 'Autentikasi diperlukan.' },
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Akses ditolak. Diperlukan role: ${roles.join(' atau ')}.`,
        },
      });
    }

    next();
  };
};

module.exports = authorize;