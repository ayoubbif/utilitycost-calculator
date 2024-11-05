import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CalculateIcon from '@mui/icons-material/Calculate';
import Visibility from '@mui/icons-material/Visibility';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { RatesTable } from './RatesTable';

export const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  calculatedRates,
  onCalculateRates,
  selectRate,
  calculating
}) => {
  const [showRatesTable, setShowRatesTable] = useState(false);
  const [selectedRateDetails, setSelectedRateDetails] = useState(null);

  useEffect(() => {
    // Update selectedRateDetails whenever project.selected_rate or calculatedRates changes
    if (project.selected_rate && calculatedRates.length > 0) {
      const rateDetails = calculatedRates.find(
        rate => rate.rate_name === project.selected_rate
      );
      setSelectedRateDetails(rateDetails);
    } else {
      setSelectedRateDetails(null);
    }
  }, [project.selected_rate, calculatedRates]);

  const toggleRatesTable = () => {
    if (!calculatedRates.length) {
      onCalculateRates();
    }
    setShowRatesTable((prevState) => !prevState);
  };

  const handleRateSelect = (rate) => {
    selectRate(project.id, rate);
    setSelectedRateDetails(rate);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
            {project.name}
          </Typography>
          <Chip
            label={project.selected_rate || 'No Rate Selected'}
            size="small"
            color={project.selected_rate ? "primary" : "default"}
          />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationOnIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {project.address || 'No address provided'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ElectricMeterIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {project.consumption ? `${project.consumption.toLocaleString()} kWh/year` : 'No consumption data'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShowChartIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {project.percentage ? `${project.percentage}% Escalator` : 'No escalator set'}
              </Typography>
            </Box>
          </Grid>
          {selectedRateDetails && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoneyIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Avg Rate: ${selectedRateDetails.avg_rate.toFixed(4)}/kWh
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoneyIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    First Year: ${selectedRateDetails.first_year_cost.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            </>
          )}
          {project.description && (
            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {project.description}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={calculatedRates.length ? "View Rates" : "Calculate Rates"}>
            <IconButton
              size="small"
              onClick={toggleRatesTable}
              disabled={calculating}
            >
              {calculatedRates.length ? (
                <Visibility fontSize="small" />
              ) : (
                <CalculateIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip title="Edit Project">
            <IconButton
              size="small"
              onClick={() => onEdit(project)}
              sx={{ mr: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Project">
            <IconButton
              size="small"
              onClick={() => onDelete(project)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
      {showRatesTable && calculatedRates.length > 0 && (
        <RatesTable
          rates={calculatedRates}
          onSelect={handleRateSelect}
          disabled={false}
          selectedRate={project.selected_rate}
        />
      )}
    </Card>
  );
};
