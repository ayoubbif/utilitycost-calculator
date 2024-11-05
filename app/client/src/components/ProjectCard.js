import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Divider,
  Grid,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BoltIcon from '@mui/icons-material/Bolt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';

export const ProjectCard = ({ project, onEdit, disabled }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {project.name}
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            {project.address}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BoltIcon color="warning" />
              <Typography variant="body2">
                Consumption:
                <Typography component="span" fontWeight="medium" ml={1}>
                  {new Intl.NumberFormat().format(project.consumption)} kWh/year
                </Typography>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PercentIcon color="info" />
              <Typography variant="body2">
                Escalator:
                <Typography component="span" fontWeight="medium" ml={1}>
                  {project.percentage}%
                </Typography>
              </Typography>
            </Box>
          </Grid>
          {project.first_year_cost && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoneyIcon color="success" />
                <Typography variant="body2">
                  First Year Cost:
                  <Typography component="span" fontWeight="medium" ml={1}>
                    {formatCurrency(project.first_year_cost)}
                  </Typography>
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
        {project.selected_rate && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label={`Selected Rate: ${project.selected_rate}`}
              color="primary"
              size="small"
              sx={{
                borderRadius: 1,
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
          </Box>
        )}
      </CardContent>
      <Divider />
      <CardActions sx={{ px: 2, py: 1.5, justifyContent: 'flex-end', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit(project)}
          disabled={disabled}
          sx={{
            textTransform: 'none'
          }}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};
