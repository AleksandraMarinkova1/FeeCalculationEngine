import { Request, Response } from "express";
import { calculateFee } from "../services/feeServices";
import { saveToHistory } from "../db/history";
import { Transaction } from "../types/Transaction";

export const calculateController = (req: Request, res: Response) => {
  const body = req.body;
  console.log("BODY", body);

  if (!body) {
    return res.status(400).json({ error: "Missing request body" });
  }

  try {
    if (Array.isArray(body)) {
  // batch
      const results = body.map((tx: Transaction) => {
        const result = calculateFee(tx);
        saveToHistory(tx, result);
        return result;
      });

      return res.status(200).json(results);
    } else {
      // Single transaction
      const tx: Transaction = body;
      const result = calculateFee(tx);
      saveToHistory(tx, result);
      return res.status(200).json(result);
    }
  } catch (err) {
    console.error("Calculation error", err);
    return res.status(500).json({ error: "Internal error during calculation" });
  }
};
