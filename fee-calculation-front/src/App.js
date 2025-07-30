import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Divider,
  Box,
} from "@mui/material";

import SingleTransaction from "./components/SingleTransaction";
import BatchTransactions from "./components/BatchTransactions";
import History from "./components/History";

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" mb={2}>
          Fee Calculation App
        </Typography>
        <Tabs value={tab} onChange={(_, t) => setTab(t)}>
          <Tab label="One Transaction" />
          <Tab label="Batch Transaction" />
          <Tab label="History" />
        </Tabs>
        <Divider sx={{ mb: 2, mt: 1 }} />

        <Box>
          {tab === 0 && <SingleTransaction />}
          {tab === 1 && <BatchTransactions />}
          {tab === 2 && <History />}
        </Box>
      </Paper>
    </Container>
  );
}
