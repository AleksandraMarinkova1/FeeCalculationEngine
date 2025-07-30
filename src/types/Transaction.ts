export interface Client {
  id: string;
  creditScore?: number;
  segment?: string;
}

export interface Transaction {
  transactionId: string;
  type: "POS" | "ECOMMERCE" | string;
  amount: number;
  currency: string;
  isForeign: boolean;
  client: Client;
}

export interface FeeResult {
  transactionId: string;
  totalFee: number;
  appliedRules: string[];
}
