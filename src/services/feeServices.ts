import { Transaction, FeeResult } from "../types/Transaction";
import { Rule1 } from "../rules/rule1";
import { Rule2 } from "../rules/rule2";
import { Rule3 } from "../rules/rule3";

const rule1 = new Rule1();
const rule2 = new Rule2();
const rule3 = new Rule3();

export function calculateFee(tx: Transaction): FeeResult {
  const appliedRules: string[] = [];
  let fee = 0;

  const r1 = rule1.apply(tx);
  if (r1) {
    fee += r1.fee;
    appliedRules.push(r1.rule);
  }

  const r2 = rule2.apply(tx);
  if (r2) {
    fee += r2.fee;
    appliedRules.push(r2.rule);
  }

  const r3 = rule3.apply(tx);
  if (r3) {
    const discount = fee * r3.discount;
    fee -= discount;
    appliedRules.push(r3.rule);
  }

  return {
    transactionId: tx.transactionId,
    totalFee: parseFloat(fee.toFixed(2)),
    appliedRules,
  };
}
