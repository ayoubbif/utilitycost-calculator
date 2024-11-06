import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

export const ProjectionChart = ({ selectedRate, project, yearlyCost }) => {
  const [view, setView] = useState('cumulativeCost');

  // Helper function to check if a year is a leap year
  const isLeapYear = (year) => {
    const currentYear = new Date().getFullYear();
    const targetYear = currentYear + year;
    return (targetYear % 4 === 0 && targetYear % 100 !== 0) || targetYear % 400 === 0;
  };

  // Generate 20 years of data with leap year adjustments
  const generateProjectionData = () => {
    if (!selectedRate || !project || !yearlyCost) return [];

    const data = [];
    const baseRate = selectedRate.avg_rate;
    const yearlyConsumption = project.consumption;
    const escalator = project.percentage / 100;
    const firstYearCost = yearlyCost;

    for (let year = 0; year <= 20; year++) {
      const rateWithEscalator = baseRate * Math.pow(1 + escalator, year);
      let yearlyCost;

      if (year === 0) {
        yearlyCost = firstYearCost;
      } else {
        yearlyCost = firstYearCost * Math.pow(1 + escalator, year);
        if (isLeapYear(year)) {
          yearlyCost *= (366 / 365);
        }
      }

      const previousCosts = data.map(d => d.cost);
      const cumulativeCost = previousCosts.reduce((sum, cost) => sum + cost, 0) + yearlyCost;

      data.push({
        year,
        rate: rateWithEscalator,
        cost: yearlyCost,
        cumulativeCost: cumulativeCost,
        consumption: yearlyConsumption,
        isLeapYear: isLeapYear(year)
      });
    }
    return data;
  };

  const projectionData = generateProjectionData();

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const formatYAxis = (value) => {
    switch (view) {
      case 'cumulativeCost':
        return `$${(value / 1000).toFixed(0)}k`;
      case 'rate':
        return `$${value.toFixed(2)}`;
      default:
        return value;
    }
  };

  const formatTooltip = (value, name) => {
    switch (name) {
      case 'cumulativeCost':
        return [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Cumulative Cost'];
      case 'rate':
        return [`$${value.toFixed(4)}/kWh`, 'Rate'];
      default:
        return [value, name];
    }
  };

  if (!selectedRate || !project || !yearlyCost) return null;

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="cumulativeCost">
          Cumulative Cost
        </ToggleButton>
        <ToggleButton value="rate">
          Rate
        </ToggleButton>
      </ToggleButtonGroup>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          height: 400,
          borderRadius: 2
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={projectionData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{
                value: 'Year',
                position: 'insideBottom',
                offset: -5
              }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              label={{
                value: view === 'cumulativeCost' ? 'Cumulative Cost ($)'
                  : 'Rate ($/kWh)',
                angle: -90,
                position: 'insideLeft'
              }}
            />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={(year) => `Year ${year}${projectionData[year]?.isLeapYear ? ' (Leap Year)' : ''}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={view}
              stroke="#1976d2"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

