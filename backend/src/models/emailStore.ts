import { db } from '../config/database';
import type { Email } from '../types/email';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

interface EmailRow extends Email, RowDataPacket {}

export async function getEmails(limit = 20): Promise<Email[]> {
  const [rows] = await db.execute<EmailRow[]>(
    `SELECT uid, subject, \`from\`, \`to\`, date, text, html, seen
     FROM emails
     ORDER BY date DESC
     LIMIT ?`,
    [limit],
  );
  return rows.map(rowToEmail);
}

export async function getEmailsByRecipient(address: string): Promise<Email[]> {
  const [rows] = await db.execute<EmailRow[]>(
    `SELECT uid, subject, \`from\`, \`to\`, date, text, html, seen
     FROM emails
     WHERE \`to\` = ?
     ORDER BY date DESC`,
    [address.toLowerCase()],
  );
  return rows.map(rowToEmail);
}

export async function getEmailByUid(uid: number): Promise<Email | null> {
  const [rows] = await db.execute<EmailRow[]>(
    `SELECT uid, subject, \`from\`, \`to\`, date, text, html, seen
     FROM emails
     WHERE uid = ?`,
    [uid],
  );
  if (rows.length === 0) return null;
  return rowToEmail(rows[0]);
}

export async function saveEmails(emails: Email[]): Promise<void> {
  if (emails.length === 0) return;

  const connection = await db.getConnection();
  try {
    for (const email of emails) {
      await connection.query<ResultSetHeader>(
        `INSERT INTO emails (uid, subject, \`from\`, \`to\`, date, text, html, seen)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           subject = VALUES(subject),
           \`from\` = VALUES(\`from\`),
           \`to\` = VALUES(\`to\`),
           date = VALUES(date),
           text = VALUES(text),
           html = VALUES(html),
           seen = VALUES(seen)`,
        [
          email.uid,
          email.subject,
          email.from,
          email.to.toLowerCase(),
          email.date,
          email.text,
          email.html,
          email.seen,
        ],
      );
    }
  } finally {
    connection.release();
  }
}

export async function deleteOldEmails(hours: number): Promise<number> {
  const [result] = await db.execute<ResultSetHeader>(
    `DELETE FROM emails WHERE created_at < DATE_SUB(NOW(), INTERVAL ? HOUR)`,
    [hours],
  );
  return result.affectedRows ?? 0;
}

export async function setEmails(newEmails: Email[]): Promise<void> {
  await saveEmails(newEmails);
}

function rowToEmail(row: EmailRow): Email {
  return {
    uid: row.uid,
    subject: row.subject,
    from: row.from,
    to: row.to,
    date: new Date(row.date),
    text: row.text,
    html: row.html,
    seen: Boolean(row.seen),
  };
}
