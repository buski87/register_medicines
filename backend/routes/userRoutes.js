const express = require('express');
const { register, login, protectedRoute } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', authenticateToken, protectedRoute); // Ruta protegida de prueba

module.exports = router;
