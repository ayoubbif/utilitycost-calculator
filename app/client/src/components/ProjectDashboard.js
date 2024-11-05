import React, { useState } from 'react';
import {
  Container,
  Typography,
  Alert,
  Box,
  Grid,
  CircularProgress,
  Backdrop
} from '@mui/material';
import { useProjects } from '../hooks/useProjects';
import { ProjectForm } from './ProjectForm';
import { ProjectCard } from './ProjectCard';
import { RatesTable } from './RatesTable';
import { ProjectEditDialog } from './ProjectEditDialog';

const ProjectDashboard = () => {
  const {
    projects,
    loading,
    error,
    setError,
    createProject,
    updateProject,
    calculateRates,
    selectRate
  } = useProjects();

  const [selectedProject, setSelectedProject] = useState(null);
  const [calculatedRates, setCalculatedRates] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const handleCalculateRates = async (projectId) => {
    setCalculating(true);
    try {
      const rates = await calculateRates(projectId);
      setCalculatedRates(rates);
      setSelectedProject(projectId);
    } catch (error) {
      setError(error.message);
    } finally {
      setCalculating(false);
    }
  };

  const handleSelectRate = async (rateData) => {
    try {
      const success = await selectRate(selectedProject, rateData);
      if (success) {
        // Clear rates view and update the projects list
        setCalculatedRates([]);
        setSelectedProject(null);

        // Show success message or handle UI update
        return true;
      }
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const handleEditClick = async (project) => {
    setProjectToEdit(project);
    setEditDialogOpen(true);
    // Pre-fetch rates for the project being edited
    try {
      const rates = await calculateRates(project.id);
      setCalculatedRates(rates);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setProjectToEdit(null);
    // Clear calculated rates if they were only being shown for editing
    if (!selectedProject) {
      setCalculatedRates([]);
    }
  };

  const handleEditSave = async (projectId, projectData) => {
    try {
      const success = await updateProject(projectId, projectData);
      if (success) {
        // If the edited project is currently selected, update the rates view
        if (selectedProject === projectId) {
          const updatedRates = await calculateRates(projectId);
          setCalculatedRates(updatedRates);
        }
        return true;
      }
      return false;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const success = await createProject(projectData);
      if (success) {
        // Clear any existing rates view
        setCalculatedRates([]);
        setSelectedProject(null);
      }
      return success;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Utility Rate Calculator
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <ProjectForm onSubmit={handleCreateProject} disabled={loading} />

        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Projects
          </Typography>

          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} md={6} key={project.id}>
                <ProjectCard
                  project={project}
                  onCalculate={handleCalculateRates}
                  onEdit={handleEditClick}
                  disabled={loading || calculating}
                  selected={selectedProject === project.id}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Global loading indicator */}
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading || calculating}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <ProjectEditDialog
          project={projectToEdit}
          open={editDialogOpen}
          onClose={handleEditClose}
          onSave={handleEditSave}
          disabled={loading}
          calculateRates={calculateRates}
          selectRate={selectRate}
          initialRates={calculatedRates}
        />
      </Box>
    </Container>
  );
};

export default ProjectDashboard;
