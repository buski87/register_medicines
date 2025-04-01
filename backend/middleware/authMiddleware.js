const jwt = require('jsonwebtoken');
const JWT_SECRET = 'supersecretkey'; // Cambiar esto por una variable de entorno

exports.authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Obtener solo el token (sin 'Bearer')

  if (!token) return res.status(401).json({ message: 'Token requerido para autenticación.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Almacenar los datos decodificados del token
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expirado. Por favor, inicia sesión nuevamente.' });
    }
    res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};
