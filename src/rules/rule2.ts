import { Transaction } from "../types/Transaction";

export class Rule2 {
  apply(tx: Transaction): { fee: number; rule: string } | null {
    if (tx.type !== "ECOMMERCE") return null;

    const fee = tx.amount * 0.018 + 0.15;
    const cappedFee = Math.min(fee, 120);
    return {
      fee: cappedFee,
      rule: "Rule2: 1.8% + 0.15€, max 120€",
    };
  }
}
