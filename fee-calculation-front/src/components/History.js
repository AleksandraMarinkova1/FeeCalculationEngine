import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import axios from "axios";

const API_BASE = "http://localhost:3000";

export default function History() {
  const [history, setHistory] = useState([]);
  const [histLoading, setHistLoading] = useState(false);

  async function loadHistory() {
    setHistLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/history`);
      setHistory(res.data);
    } catch {
      setHistory([]);
    }
    setHistLoading(false);
  }

  useEffect(() => {
    loadHistory();
  }, []);

  
  function safeParseJson(str) {
    if (!str) return {};
    if (typeof str === "object") return str;
    try {
      return JSON.parse(str);
    } catch {
      return {};
    }
  }

  return (
    <Box>
      <Button onClick={loadHistory} variant="contained" sx={{ mb: 2 }}>
        Refresh
      </Button>
      {histLoading ? (
        <CircularProgress />
      ) : (
        <Paper variant="outlined">
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Transaction Input</TableCell>
                <TableCell>Total Fee (€)</TableCell>
                <TableCell>Applied Rules</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No history available
                  </TableCell>
                </TableRow>
              )}
              {history.map((h, idx) => {
                const input = safeParseJson(h.input);
                const output = safeParseJson(h.output); 

                const fee = output.totalFee ?? output.fee ?? "-";

              
                const rules = output.appliedRules || output.rulesApplied || output.details || [];

                return (
                  <TableRow key={h.id || idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <pre style={{ margin: 0, fontSize: 11, whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(input, null, 2)}
                      </pre>
                    </TableCell>
                    <TableCell>{typeof fee === "number" ? fee.toFixed(2) : fee}</TableCell>
                    <TableCell>
                      {Array.isArray(rules) && rules.length > 0 ? (
                        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12 }}>
                          {rules.map((rule, i) => (
                            <li key={i}>{rule}</li>
                          ))}
                        </ul>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {h.timestamp
                        ? new Date(h.timestamp).toLocaleString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
