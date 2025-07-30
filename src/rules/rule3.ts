import { Transaction } from "../types/Transaction";

export class Rule3 {
  apply(tx: Transaction): { discount: number; rule: string } | null {
    if (tx.client.creditScore && tx.client.creditScore > 400) {
      return {
        discount: 0.01,
        rule: "Rule3: 1% discount for creditScore > 400",
      };
    }
    return null;
  }
}
