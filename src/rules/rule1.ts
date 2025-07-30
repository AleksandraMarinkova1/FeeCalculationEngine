import { Transaction } from "../types/Transaction";

export class Rule1 {
  apply(tx: Transaction): { fee: number; rule: string } | null {
    if (tx.type !== "POS") return null;

    if (tx.amount <= 100) {
      return { fee: 0.2, rule: "Rule1: POS <= 100 => 0.20€" };
    } else {
      return { fee: tx.amount * 0.002, rule: "Rule1: POS > 100 => 0.2%" };
    }
  }
}
