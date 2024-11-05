import React, { useState } from 'react';
import { Paper, Typography, Button, TextField, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const initialProjectState = {
  name: '',
  address: '',
  description: '',
  consumption: '',
  percentage: ''
};

export const ProjectForm = ({ onSubmit, disabled }) => {
  const [newProject, setNewProject] = useState(initialProjectState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(newProject);
    if (success) {
      setNewProject(initialProjectState);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Create New Project
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Project Name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address"
              value={newProject.address}
              onChange={(e) =>
                setNewProject({ ...newProject, address: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Yearly Consumption (kWh)"
              value={newProject.consumption}
              onChange={(e) =>
                setNewProject({ ...newProject, consumption: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Escalator Percentage"
              value={newProject.percentage}
              onChange={(e) =>
                setNewProject({ ...newProject, percentage: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
          disabled={disabled}
        >
          Create Project
        </Button>
      </form>
    </Paper>
  );
};
