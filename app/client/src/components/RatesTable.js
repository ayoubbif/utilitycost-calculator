import React from 'react';
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const RatesTable = ({ rates, onSelect, disabled }) => (
  <Paper sx={{ mt: 4, p: 2 }}>
    <Typography variant="h6" gutterBottom>
      Available Utility Rates
    </Typography>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rate Name</TableCell>
            <TableCell>Utility</TableCell>
            <TableCell align="right">Average Rate</TableCell>
            <TableCell align="right">First Year Cost</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rates.map((rate) => (
            <TableRow key={rate.uniqueId}>
              <TableCell>{rate.rate_name}</TableCell>
              <TableCell>{rate.utility}</TableCell>
              <TableCell align="right">
                ${rate.avg_rate.toFixed(4)}/kWh
              </TableCell>
              <TableCell align="right">
                ${rate.first_year_cost.toFixed(2)}
              </TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => onSelect(rate)}
                  disabled={disabled}
                >
                  Select
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);
