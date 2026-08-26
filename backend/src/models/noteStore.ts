import { db } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { generateSlug } from '../utils/slug';

export interface Note {
  id: number;
  slug: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteRow extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

function rowToNote(row: NoteRow): Note {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createNote(
  title: string,
  content: string,
): Promise<Note> {
  const connection = await db.getConnection();
  try {
    let slug: string;
    let exists = true;
    while (exists) {
      slug = generateSlug();
      const [rows] = await connection.execute<NoteRow[]>(
        'SELECT id FROM notes WHERE slug = ?',
        [slug],
      );
      exists = rows.length > 0;
    }

    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO notes (slug, title, content) VALUES (?, ?, ?)',
      [slug!, title, content],
    );

    const note = await getNoteBySlug(slug!);
    if (!note) {
      throw new Error('Failed to create note');
    }
    return note;
  } finally {
    connection.release();
  }
}

export async function getAllNotes(): Promise<Note[]> {
  const [rows] = await db.execute<NoteRow[]>(
    'SELECT id, slug, title, content, created_at, updated_at FROM notes ORDER BY id DESC',
  );
  return rows.map(rowToNote);
}

export async function getNoteBySlug(slug: string): Promise<Note | null> {
  const [rows] = await db.execute<NoteRow[]>(
    'SELECT id, slug, title, content, created_at, updated_at FROM notes WHERE slug = ?',
    [slug],
  );
  if (rows.length === 0) return null;
  return rowToNote(rows[0]);
}

export async function updateNote(
  slug: string,
  title: string,
  content: string,
): Promise<Note | null> {
  const connection = await db.getConnection();
  try {
    await connection.execute<ResultSetHeader>(
      'UPDATE notes SET title = ?, content = ? WHERE slug = ?',
      [title, content, slug],
    );
    return getNoteBySlug(slug);
  } finally {
    connection.release();
  }
}

export async function deleteNote(slug: string): Promise<boolean> {
  const [result] = await db.execute<ResultSetHeader>(
    'DELETE FROM notes WHERE slug = ?',
    [slug],
  );
  return (result.affectedRows ?? 0) > 0;
}
