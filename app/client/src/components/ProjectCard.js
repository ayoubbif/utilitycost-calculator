import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShowChartIcon from '@mui/icons-material/ShowChart';

export const ProjectCard = ({
  project,
  onEdit,
  onDelete
}) => {
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
            label={`${project.selected_rate || 'No Rate Selected'}`}
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

      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
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
      </CardActions>
    </Card>
  );
};
