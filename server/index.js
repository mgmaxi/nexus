const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Importante para encriptar
const User = require('./models/User'); // Importante para guardar
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a Base de Datos
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log('🟢 CONECTADO A MONGODB (Nexus DB)'))
	.catch(err => console.error('🔴 Error conectando a Mongo:', err));

// RUTA DE PRUEBA
app.get('/', (req, res) => {
	res.send('API de Nexus funcionando 🚀');
});

// --- RUTAS DE AUTENTICACIÓN ---

// 1. REGISTRO (Esta es la que estaba fallando)
app.post('/api/register', async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Verificar si ya existe
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ error: 'El usuario ya existe' });
		}

		// Encriptar contraseña
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Crear usuario
		const newUser = new User({
			name,
			email,
			password: hashedPassword,
			role: 'admin',
		});

		await newUser.save();
		res.status(201).json({ message: 'Usuario creado con éxito' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// 2. LOGIN (Para NextAuth)
app.post('/api/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		// Buscar usuario
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

		// Comparar contraseña
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ error: 'Contraseña incorrecta' });

		// Responder OK
		res.json({
			id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Arrancar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`Servidor escuchando en puerto ${PORT}`);
});
