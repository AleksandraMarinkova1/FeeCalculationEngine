import Database from "better-sqlite3";
import { Transaction, FeeResult } from "../types/Transaction";

const db = new Database("history.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS fee_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transactionId TEXT,
    input TEXT,
    output TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

export function saveToHistory(tx: Transaction, result: FeeResult) {
  const stmt = db.prepare(`
    INSERT INTO fee_history (transactionId, input, output)
    VALUES (?, ?, ?)
  `);

  stmt.run(tx.transactionId, JSON.stringify(tx), JSON.stringify(result));
}

export function getHistory() {
  const stmt = db.prepare("SELECT * FROM fee_history ORDER BY timestamp DESC");
  return stmt.all();
}
