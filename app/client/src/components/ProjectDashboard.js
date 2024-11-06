import React, { useState } from 'react';
import {
  Container,
  Typography,
  Alert,
  Box,
  Stack,
  CircularProgress,
  Backdrop
} from '@mui/material';
import { useProjects } from '../hooks/useProjects';
import { ProjectForm } from './ProjectForm';
import { ProjectCard } from './ProjectCard';
import { ProjectEditDialog } from './ProjectEditDialog';

const ProjectDashboard = () => {
  const {
    projects,
    loading,
    error,
    setError,
    createProject,
    updateProject,
    deleteProject,
    calculateRates,
    selectRate
  } = useProjects();

  const [projectRates, setProjectRates] = useState({});
  const [calculating, setCalculating] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  const handleCalculateRates = async (projectId) => {
    if (!projectRates[projectId]) {
      setCalculating(true);
      try {
        const rates = await calculateRates(projectId);
        setProjectRates(prev => ({
          ...prev,
          [projectId]: rates
        }));
      } catch (error) {
        setError(error.message);
      } finally {
        setCalculating(false);
      }
    }
  };

  const handleEditClick = (project) => {
    setProjectToEdit(project);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setProjectToEdit(null);
  };

  const handleEditSave = async (projectId, projectData) => {
    try {
      const success = await updateProject(projectId, projectData);
      if (success) {
        if (projectData.consumption !== projectToEdit.consumption ||
            projectData.percentage !== projectToEdit.percentage) {
          setProjectRates(prev => {
            const newRates = { ...prev };
            delete newRates[projectId];
            return newRates;
          });
          await handleCalculateRates(projectId);
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
      return success;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!projectId) {
      setError('Invalid project ID');
      return false;
    }

    try {
      const success = await deleteProject(projectId);
      if (success) {
        setProjectRates(prev => {
          const newRates = { ...prev };
          delete newRates[projectId];
          return newRates;
        });
      }
      return success;
    } catch (error) {
      setError(error.message || 'Failed to delete project');
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

        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your Projects
          </Typography>

          <Stack spacing={2}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => handleEditClick(project)}
                onDelete={() => handleDeleteProject(project.id)}
                calculatedRates={projectRates[project.id] || []}
                onCalculateRates={() => handleCalculateRates(project.id)}
                selectRate={selectRate}
                calculating={calculating}
              />
            ))}
          </Stack>
        </Box>

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <ProjectEditDialog
          project={projectToEdit}
          open={editDialogOpen}
          onClose={handleEditClose}
          onSave={handleEditSave}
          disabled={loading}
        />
      </Box>
    </Container>
  );
};

export default ProjectDashboard;
