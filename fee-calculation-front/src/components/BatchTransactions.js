import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const API_BASE = "http://localhost:3000";

export default function BatchTransactions() {
  const [batchText, setBatchText] = useState("");
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchRes, setBatchRes] = useState(null);

  async function submitBatch(e) {
    e.preventDefault();
    setBatchLoading(true);
    setBatchRes(null);
    let data = [];
    try {
      data = JSON.parse(batchText);
      if (!Array.isArray(data)) throw new Error("Внесете валиден JSON array!");
    } catch (e) {
      setBatchRes({ error: e.message });
      setBatchLoading(false);
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/batch-calculate`, data);
      setBatchRes(res.data);
    } catch (err) {
      setBatchRes({ error: err.message });
    }
    setBatchLoading(false);
  }
  console.log("batch", batchRes);

  return (
    <Box component="form" onSubmit={submitBatch}>
      <Typography>Enter JSON array of transactions (example):</Typography>
      <pre>{`[{"amount":80,"type":"POS","creditScore":410,"currency":"EUR"}]`}</pre>

      <TextField
        fullWidth
        multiline
        minRows={6}
        margin="normal"
        value={batchText}
        onChange={(e) => setBatchText(e.target.value)}
        placeholder={`[{"amount":80,"type":"POS","creditScore":410,"currency":"EUR"}]`}
      />
      <Button variant="contained" type="submit" disabled={batchLoading}>
        Batch calculation
      </Button>
      {batchLoading && <CircularProgress size={26} sx={{ ml: 2 }} />}
      {batchRes && typeof batchRes === "object" && (
        <Box mt={2}>
          <Typography>Batch Results:</Typography>
          {batchRes.map((result, index) => (
            <Box
              key={index}
              mb={2}
              style={{ background: "#f5f5f5", padding: 8, borderRadius: 4 }}
            >
              <Typography>
                Result #{index + 1}: {result.totalFee ?? "No result available"}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
