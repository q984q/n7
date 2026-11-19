import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import type { LeadRecord } from './cms';

export const storageDir = process.env.N7_DATA_DIR || path.join(process.cwd(), 'data');
export const uploadsDir = path.join(storageDir, 'uploads');
function withDb<T>(run: (db: DatabaseSync) => T): T {
  mkdirSync(storageDir, {recursive:true});
  const db = new DatabaseSync(path.join(storageDir, 'leads.sqlite'));
  try {
    db.exec('PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, body TEXT NOT NULL)');
    return run(db);
  } finally { db.close(); }
}
export function readLeads(): LeadRecord[] {
  return withDb(db => db.prepare('SELECT body FROM leads ORDER BY rowid DESC').all().map(row => JSON.parse(String(row.body))));
}
export function addLead(lead: LeadRecord) {
  withDb(db => db.prepare('INSERT INTO leads VALUES (?,?)').run(lead.ticketId, JSON.stringify(lead)));
}
export function saveLead(lead: LeadRecord) {
  withDb(db => db.prepare('UPDATE leads SET body=? WHERE id=?').run(JSON.stringify(lead), lead.ticketId));
}
export function deleteLead(id: string) { withDb(db => db.prepare('DELETE FROM leads WHERE id=?').run(id)); }
