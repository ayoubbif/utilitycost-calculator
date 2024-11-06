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
  Collapse,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ElectricMeter as ElectricMeterIcon,
  LocationOn as LocationOnIcon,
  ShowChart as ShowChartIcon,
  Visibility,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
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
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  calculatedRates = [],
  onCalculateRates,
  selectRate,
  calculating = false
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRateDetails, setSelectedRateDetails] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [hasCalculatedRates, setHasCalculatedRates] = useState(false);

  useEffect(() => {
    if (project.selected_rate && calculatedRates.length > 0) {
      const rateDetails = calculatedRates.find(
        (rate) => rate.rate_name === project.selected_rate
      );
      setSelectedRateDetails(rateDetails);
    } else {
      setSelectedRateDetails(null);
    }
    setError(
      !calculating && calculatedRates.length === 0 && hasCalculatedRates
    );
  }, [project.selected_rate, calculatedRates, calculating, hasCalculatedRates]);

  const handleShowDetails = async () => {
    if (!showDetails && !hasCalculatedRates) {
      setLoading(true);
      try {
        await onCalculateRates();
        setHasCalculatedRates(true);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    setShowDetails(!showDetails);
  };

  const handleRateSelect = (rate) => {
    if (rate && project?.id) {
      selectRate(project.id, rate);
      setSelectedRateDetails(rate);
    }
  };

  const CardContentSkeleton = () => (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2
        }}
      >
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

  const RateDetailsSection = () => {
    if (!selectedRateDetails) return null;

    return (
      <Paper
        elevation={0}
        sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, mb: 2 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AttachMoneyIcon
                sx={{ color: 'primary.dark' }}
                fontSize="small"
              />
              <Typography
                variant="body2"
                sx={{ color: 'primary.dark', fontWeight: 700 }}
              >
                Avg Rate: $
                {selectedRateDetails.avg_rate?.toFixed(4) || '0.0000'}/kWh
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AttachMoneyIcon
                sx={{ color: 'primary.dark' }}
                fontSize="small"
              />
              <Typography
                variant="body2"
                sx={{ color: 'primary.dark', fontWeight: 700 }}
              >
                First Year: $
                {selectedRateDetails.first_year_cost?.toFixed(2) || '0.00'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  };

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
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 600, color: 'primary.main' }}
          >
            {project?.name || 'Untitled Project'}
          </Typography>
          <Chip
            label={project?.selected_rate || 'No Rate Selected'}
            size="small"
            color={project?.selected_rate ? 'primary' : 'default'}
            sx={{ fontWeight: 500, px: 1, borderRadius: 1.5 }}
          />
        </Box>

        <Paper
          elevation={0}
          sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, mb: 2 }}
        >
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocationOnIcon color="primary" fontSize="small" />
                <Typography variant="body2">
                  {project?.address || 'No address provided'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ElectricMeterIcon color="primary" fontSize="small" />
                <Typography variant="body2">
                  {project?.consumption
                    ? `${project.consumption.toLocaleString()} kWh/year`
                    : 'No consumption data'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ShowChartIcon color="primary" fontSize="small" />
                <Typography variant="body2">
                  {project?.percentage
                    ? `${project.percentage}% Escalator`
                    : 'No escalator set'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Collapse in={!!selectedRateDetails}>
          <RateDetailsSection />
        </Collapse>

        {project?.description && (
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

        <Collapse in={error}>
          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1 }}>
              No rates found for this project
            </Alert>
          )}
        </Collapse>
      </CardContent>

      {loading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, p: 3 }}>
          <CardContentSkeleton />
        </Box>
      )}

      <CardActions
        sx={{ justifyContent: 'space-between', px: 3, pb: 3, pt: 0 }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={showDetails ? 'Hide Details' : 'Show Details'}>
            <IconButton
              size="small"
              onClick={handleShowDetails}
              disabled={calculating}
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
              onClick={() => project && onEdit(project)}
              sx={{
                bgcolor: 'action.hover',
                '&:hover': { bgcolor: 'action.selected' }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Project">
            <IconButton
              size="small"
              onClick={() => project && onDelete(project)}
              sx={{
                bgcolor: 'error.light',
                '&:hover': {
                  bgcolor: 'error.main',
                  '& .MuiSvgIcon-root': { color: 'white' }
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>

      <Collapse in={showDetails && calculatedRates?.length > 0}>
        <Box sx={{ px: 3, pb: 3 }}>
          <Paper
            elevation={0}
            sx={{ bgcolor: 'background.default', borderRadius: 2 }}
          >
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
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
                selectedRate={project?.selected_rate}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {selectedRateDetails ? (
                <ProjectionChart
                  selectedRate={selectedRateDetails}
                  project={project}
                  yearlyCost={selectedRateDetails.first_year_cost || 0}
                />
              ) : (
                <Typography variant="body2" sx={{ textAlign: 'center', py: 2 }}>
                  Please select a rate to view projections
                </Typography>
              )}
            </TabPanel>
          </Paper>
        </Box>
      </Collapse>
    </Card>
  );
};
