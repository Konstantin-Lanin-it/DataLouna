import { Router } from 'express';
import { createUser, findUserByUsername, changePassword } from '../models/user';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await createUser(username, password);
    req.session.userId = user.id;
    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: 'User registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await findUserByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id;
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/change-password', async (req, res) => {
  const { username, newPassword } = req.body;
  
  try {
    await changePassword(username, newPassword);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

export default router;