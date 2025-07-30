import express from "express";
import cors from "cors";
import { calculateController } from "./controllers/calculateController";
import { historyController } from "./controllers/historyController";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/calculate", calculateController);
app.post("/batch-calculate", calculateController);
app.get("/history", historyController);

app.listen(PORT, () => {
  console.log(`Fee Engine API running on http://localhost:${PORT}`);
});
