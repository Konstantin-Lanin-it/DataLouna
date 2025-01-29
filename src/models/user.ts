import client from '../db/db';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  username: string;
  password: string;
}

export const createUser = async (username: string, password: string): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const res = await client.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
    [username, hashedPassword]
  );

  return res.rows[0];
};

export const findUserByUsername = async (username: string): Promise<User | null> => {
  const res = await client.query('SELECT * FROM users WHERE username = $1', [username]);
  return res.rows[0] || null;
};

export const changePassword = async (username: string, newPassword: string): Promise<void> => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await client.query('UPDATE users SET password = $1 WHERE username = $2', [hashedPassword, username]);
};