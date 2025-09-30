import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';  

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your-secret-key'; 

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

let users = [];
let notes = [];

// Automatically create default admin user
(async () => {
  const defaultAdminUsername = "Admin";
  const defaultAdminPassword = "123456";

  const existingAdmin = users.find(u => u.username === defaultAdminUsername);
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10);
    const adminUser = { id: users.length + 1, username: defaultAdminUsername, password: hashedPassword, role: "admin" };
    users.push(adminUser);
    console.log(`Default admin created - username: ${defaultAdminUsername}, password: ${defaultAdminPassword}`);
  }
})();

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, username, password: hashedPassword, role };
  users.push(user);
  res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Get all users (admin only)
app.get('/users', authenticateToken, isAdmin, (req, res) => {
  res.json(users.map(u => ({ id: u.id, username: u.username, role: u.role })));
});

// Get a single user by id (admin or self)
app.get('/user/:id', authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ error: 'User not found' });
  if (req.user.role !== 'admin' && req.user.id !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json({ id: user.id, username: user.username, role: user.role });
});

// Update user by id (admin or self)
app.put('/user/:id', authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, password, role } = req.body;

  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

  // Only admin can update role
  if (role && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admin can update role' });
  }

  if (username) users[userIndex].username = username;
  if (password) users[userIndex].password = await bcrypt.hash(password, 10);
  if (role) users[userIndex].role = role;

  res.json({ message: 'User updated successfully', user: { id: users[userIndex].id, username: users[userIndex].username, role: users[userIndex].role } });
});

// Delete user by id (admin only)
app.delete('/user/:id', authenticateToken, isAdmin, (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

  users.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully' });
});

// Add note (protected)
app.post('/notes', authenticateToken, (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description required' });
  }

  const note = { id: notes.length + 1, title, description, userId: req.user.id };
  notes.push(note);
  res.status(201).json(note);
});

// Get all notes (protected)
app.get('/notes', authenticateToken, (req, res) => {
  const userNotes = notes.filter(note => note.userId === req.user.id || req.user.role === 'admin');
  res.json(userNotes);
});

// Delete note (admin only)
app.delete('/notes/:id', authenticateToken, isAdmin, (req, res) => {
  const noteId = parseInt(req.params.id);
  const noteIndex = notes.findIndex(note => note.id === noteId);
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  notes.splice(noteIndex, 1);
  res.json({ message: 'Note deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
