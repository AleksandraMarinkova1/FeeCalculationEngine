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

export default function SingleTransaction() {
  const [single, setSingle] = useState({
    amount: "",
    type: "",
    currency: "EUR",
    creditScore: "",
  });
  const [singleRes, setSingleRes] = useState(null);
  const [singleLoad, setSingleLoad] = useState(false);

  function handleSingleChange(e) {
    setSingle((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function submitSingle(e) {
    e.preventDefault();
    setSingleLoad(true);
    setSingleRes(null);
    try {
      const res = await axios.post(`${API_BASE}/calculate`, {
        ...single,
        amount: Number(single.amount),
        creditScore: Number(single.creditScore),
      });
      setSingleRes(res.data);
    } catch (err) {
      setSingleRes({ error: err.message });
    }
    setSingleLoad(false);
  }
  console.log("singleRes", singleRes);

  return (
    <Box component="form" onSubmit={submitSingle} sx={{ maxWidth: 450 }}>
      <TextField
        fullWidth
        margin="normal"
        name="amount"
        label="Amount(€)"
        value={single.amount}
        type="number"
        required
        onChange={handleSingleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        name="type"
        label="Type (POS, ecommerce, ...)"
        value={single.type}
        required
        onChange={handleSingleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        name="currency"
        label="Currency"
        value={single.currency}
        onChange={handleSingleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        name="creditScore"
        label="Credit Score"
        value={single.creditScore}
        type="number"
        onChange={handleSingleChange}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 2 }}
        disabled={singleLoad}
      >
        Calculate
      </Button>
      {singleLoad && <CircularProgress size={28} sx={{ ml: 2 }} />}
      {singleRes && !singleRes.error && (
        <Box mt={2}>
          <Typography color="primary">Result: {singleRes.totalFee} €</Typography>
          <Typography fontSize={14}>
            Details: {JSON.stringify(singleRes.appliedRules)}
          </Typography>
        </Box>
      )}
      {singleRes && singleRes.error && (
        <Typography color="error" mt={2}>
          Error: {singleRes.error}
        </Typography>
      )}
    </Box>
  );
}
