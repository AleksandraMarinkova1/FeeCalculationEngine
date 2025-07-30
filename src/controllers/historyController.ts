import { Request, Response } from "express";
import { getHistory } from "../db/history";

export const historyController = (req: Request, res: Response) => {
  const data = getHistory();
  res.status(200).json(data);
};
