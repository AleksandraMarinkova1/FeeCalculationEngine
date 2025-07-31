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
  Modal,
} from "@mui/material";
import axios from "axios";
import Alert from "@mui/material/Alert";

const API_BASE = "http://localhost:3000";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 300,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function History() {
  const [history, setHistory] = useState([]);
  const [histLoading, setHistLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [clearItemLoading, setClearItemLoading] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalAction, setModalAction] = useState(null);
  const [setAlert] = useState({
    severity: "",
    message: "",
    open: false,
  });

  function showAlert(severity, message) {
    setAlert({ severity, message, open: true });
  }

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

  async function clearHistory() {
    setClearLoading(true);
    try {
      await axios.delete(`${API_BASE}/history`);
      setHistory([]);
      showAlert("success", "History cleared successfully.");
    } catch (err) {
      showAlert("error", "Failed to clear history.");
    }
    setClearLoading(false);
  }

  async function clearHistoryItem(id) {
    setClearItemLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.delete(`${API_BASE}/history/${id}`);
      setHistory((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      <Alert severity="error">Failed to delete history item.</Alert>;
    }
    setClearItemLoading((prev) => ({ ...prev, [id]: false }));
  }

  function openConfirmModal(text, action) {
    setModalText(text);
    setModalAction(() => action);
    setModalOpen(true);
  }

  function handleConfirm() {
    if (typeof modalAction === "function") {
      modalAction();
    }
    setModalOpen(false);
  }

  function handleClose() {
    setModalOpen(false);
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
      <Box mb={2} display="flex" gap={2}>
        <Button
          onClick={loadHistory}
          variant="contained"
          disabled={histLoading || clearLoading}
        >
          Refresh
        </Button>

        <Button
          onClick={() =>
            openConfirmModal(
              "Are you sure you want to delete all history?",
              clearHistory
            )
          }
          variant="outlined"
          color="error"
          disabled={clearLoading || histLoading || history.length === 0}
        >
          {clearLoading ? "Clearing..." : "Clear All History"}
        </Button>
      </Box>

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
                <TableCell>Timestamp</TableCell>
                <TableCell>Actions</TableCell>
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

                return (
                  <TableRow key={h.id || idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <pre
                        style={{
                          margin: 0,
                          fontSize: 11,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {JSON.stringify(input, null, 2)}
                      </pre>
                    </TableCell>
                    <TableCell>
                      {typeof fee === "number" ? fee.toFixed(2) : fee}
                    </TableCell>

                    <TableCell>
                      {h.timestamp
                        ? new Date(h.timestamp).toLocaleString()
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        disabled={clearItemLoading[h.id]}
                        onClick={() =>
                          openConfirmModal(
                            "Are you sure you want to delete this transaction?",
                            () => clearHistoryItem(h.id)
                          )
                        }
                      >
                        {clearItemLoading[h.id] ? "Deleting..." : "Delete"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {modalText}
          </Typography>
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleConfirm}>
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
