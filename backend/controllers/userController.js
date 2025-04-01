const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const users = []; // Temporal, deberías usar una base de datos
const JWT_SECRET = 'supersecretkey'; // Cambiar esto por una variable de entorno

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });

  res.json({ message: 'Usuario registrado con éxito.' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'Usuario no encontrado.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta.' });

  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

exports.protectedRoute = (req, res) => {
  res.json({ message: 'Acceso permitido a ruta protegida.' });
};
