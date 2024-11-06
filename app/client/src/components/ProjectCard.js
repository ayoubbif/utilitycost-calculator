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
  Alert,
  Skeleton,
  Fade,
  Collapse,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import Visibility from '@mui/icons-material/Visibility';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { RatesTable } from './RatesTable';
import { ProjectionChart } from './ProjectionChart';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  calculatedRates,
  onCalculateRates,
  selectRate,
  calculating
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRateDetails, setSelectedRateDetails] = useState(null);
  const [error, setError] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const calculateInitialRates = async () => {
      await onCalculateRates();
      setTimeout(() => setIsInitialLoad(false), 300);
    };
    calculateInitialRates();
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      if (project.selected_rate && calculatedRates.length > 0) {
        const rateDetails = calculatedRates.find(
          rate => rate.rate_name === project.selected_rate
        );
        setSelectedRateDetails(rateDetails);
      } else {
        setSelectedRateDetails(null);
      }
      setError(!calculating && calculatedRates.length === 0);
    }
  }, [project.selected_rate, calculatedRates, calculating, isInitialLoad]);

  const toggleDetails = () => setShowDetails((prev) => !prev);
  const handleRateSelect = (rate) => {
    selectRate(project.id, rate);
    setSelectedRateDetails(rate);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const CardContentSkeleton = () => (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Skeleton width={150} height={32} />
        <Skeleton width={100} height={24} />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Skeleton width="80%" height={24} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Skeleton width="70%" height={24} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Skeleton width="60%" height={24} />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <Fade in={!isInitialLoad} timeout={400}>
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3
          }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                color: 'primary.main'
              }}
            >
              {project.name}
            </Typography>
            <Chip
              label={project.selected_rate || 'No Rate Selected'}
              size="small"
              color={project.selected_rate ? "primary" : "default"}
              sx={{
                fontWeight: 500,
                px: 1,
                borderRadius: 1.5
              }}
            />
          </Box>

          <Paper
            elevation={0}
            sx={{
              bgcolor: 'background.default',
              p: 2,
              borderRadius: 2,
              mb: 2
            }}
          >
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LocationOnIcon color="primary" fontSize="small" />
                  <Typography variant="body2">
                    {project.address || 'No address provided'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ElectricMeterIcon color="primary" fontSize="small" />
                  <Typography variant="body2">
                    {project.consumption ? `${project.consumption.toLocaleString()} kWh/year` : 'No consumption data'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ShowChartIcon color="primary" fontSize="small" />
                  <Typography variant="body2">
                    {project.percentage ? `${project.percentage}% Escalator` : 'No escalator set'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Collapse in={!!selectedRateDetails} timeout={300}>
            {selectedRateDetails && (
              <Paper
                elevation={0}
                sx={{
                  bgcolor: 'background.default',
                  p: 2,
                  borderRadius: 2,
                  mb: 2
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <AttachMoneyIcon sx={{ color: 'primary.dark' }} fontSize="small" />
                      <Typography variant="body2" sx={{ color: 'primary.dark', fontWeight: 700 }}>
                        Avg Rate: ${selectedRateDetails.avg_rate.toFixed(4)}/kWh
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <AttachMoneyIcon sx={{ color: 'primary.dark' }} fontSize="small" />
                      <Typography variant="body2" sx={{ color: 'primary.dark', fontWeight: 700 }}>
                        First Year: ${selectedRateDetails.first_year_cost.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Collapse>

          {project.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 2,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.6
              }}
            >
              {project.description}
            </Typography>
          )}

          <Collapse in={error} timeout={300}>
            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: 2,
                  borderRadius: 1
                }}
              >
                No rates found for this project
              </Alert>
            )}
          </Collapse>
        </CardContent>
      </Fade>

      {isInitialLoad && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, p: 3 }}>
          <CardContentSkeleton />
        </Box>
      )}

      <Fade in={!isInitialLoad} timeout={400}>
        <CardActions sx={{ justifyContent: 'space-between', px: 3, pb: 3, pt: 0 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={showDetails ? "Hide Details" : "Show Details"}>
              <IconButton
                size="small"
                onClick={toggleDetails}
                disabled={calculating || error}
                sx={{
                  bgcolor: showDetails ? 'primary.main' : 'action.hover',
                  color: showDetails ? 'white' : 'inherit',
                  '&:hover': {
                    bgcolor: showDetails ? 'primary.dark' : 'action.selected'
                  }
                }}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit Project">
              <IconButton
                size="small"
                onClick={() => onEdit(project)}
                sx={{
                  bgcolor: 'action.hover',
                  '&:hover': {
                    bgcolor: 'action.selected'
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Project">
              <IconButton
                size="small"
                onClick={() => onDelete(project)}
                sx={{
                  bgcolor: 'error.light',
                  '&:hover': {
                    bgcolor: 'error.main',
                    '& .MuiSvgIcon-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
      </Fade>

      <Collapse in={showDetails && calculatedRates.length > 0} timeout={300}>
        {showDetails && calculatedRates.length > 0 && (
          <Box sx={{ px: 3, pb: 3 }}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'background.default',
                borderRadius: 2
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Rates" />
                <Tab label="Projections" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <RatesTable
                  rates={calculatedRates}
                  onSelect={handleRateSelect}
                  disabled={false}
                  selectedRate={project.selected_rate}
                />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <ProjectionChart
                  selectedRate={selectedRateDetails}
                  project={project}
                  yearlyCost={selectedRateDetails.first_year_cost}
                />
              </TabPanel>
            </Paper>
          </Box>
        )}
      </Collapse>
    </Card>
  );
};
