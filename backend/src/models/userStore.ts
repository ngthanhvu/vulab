import { db } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    password: row.password,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function findUserByUsername(
  username: string,
): Promise<User | null> {
  const [rows] = await db.execute<UserRow[]>(
    'SELECT id, username, password, role, created_at, updated_at FROM users WHERE username = ?',
    [username],
  );
  if (rows.length === 0) return null;
  return rowToUser(rows[0]);
}

export async function getAllUsers(): Promise<User[]> {
  const [rows] = await db.execute<UserRow[]>(
    'SELECT id, username, password, role, created_at, updated_at FROM users ORDER BY id DESC',
  );
  return rows.map(rowToUser);
}

export async function createUser(
  username: string,
  password: string,
  role = 'admin',
): Promise<User> {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, password, role],
  );

  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error('Failed to create user');
  }
  return user;
}

export async function updateUser(
  id: number,
  updates: { username?: string; password?: string; role?: string },
): Promise<User | null> {
  const existing = await findUserById(id);
  if (!existing) return null;

  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (updates.username !== undefined) {
    fields.push('username = ?');
    values.push(updates.username);
  }
  if (updates.password !== undefined) {
    fields.push('password = ?');
    values.push(updates.password);
  }
  if (updates.role !== undefined) {
    fields.push('role = ?');
    values.push(updates.role);
  }

  if (fields.length === 0) return existing;

  values.push(id);
  await db.execute<ResultSetHeader>(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values,
  );

  return findUserById(id);
}

export async function deleteUser(id: number): Promise<boolean> {
  const [result] = await db.execute<ResultSetHeader>(
    'DELETE FROM users WHERE id = ?',
    [id],
  );
  return (result.affectedRows ?? 0) > 0;
}

export async function findUserById(id: number): Promise<User | null> {
  const [rows] = await db.execute<UserRow[]>(
    'SELECT id, username, password, role, created_at, updated_at FROM users WHERE id = ?',
    [id],
  );
  if (rows.length === 0) return null;
  return rowToUser(rows[0]);
}


