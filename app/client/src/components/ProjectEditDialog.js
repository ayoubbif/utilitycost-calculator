import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

export const ProjectEditDialog = ({
  project,
  open,
  onClose,
  onSave,
  disabled,
  calculateRates,
  selectRate,
  initialRates = []
}) => {
  const [editedProject, setEditedProject] = useState({
    name: '',
    address: '',
    description: '',
    consumption: '',
    percentage: '',
    selectedRate: ''
  });

  const [availableRates, setAvailableRates] = useState([]);
  const [loadingRates, setLoadingRates] = useState(false);

  useEffect(() => {
    if (project) {
      setEditedProject({
        name: project.name || '',
        address: project.address || '',
        description: project.description || '',
        consumption: project.consumption || '',
        percentage: project.percentage || '',
        selectedRate: project.selected_rate || ''
      });

      if (initialRates.length > 0) {
        setAvailableRates(initialRates.map(rate => ({
          ...rate,
          uniqueId: `${rate.rate_name} - ${rate.utility}`
        })));
      } else {
        const fetchRates = async () => {
          setLoadingRates(true);
          try {
            const rates = await calculateRates(project.id);
            setAvailableRates(rates.map(rate => ({
              ...rate,
              uniqueId: `${rate.rate_name} - ${rate.utility}`
            })));
          } catch (error) {
            console.error('Error fetching rates:', error);
          }
          setLoadingRates(false);
        };
        fetchRates();
      }
    }
  }, [project, calculateRates, initialRates]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [rateName, utility] = editedProject.selectedRate.split(' - ');

    if (editedProject.selectedRate && editedProject.selectedRate !== project.selected_rate) {
      await selectRate(project.id, {
        rate_name: rateName,
        utility: utility
      });
    }

    const success = await onSave(project.id, {
      name: editedProject.name,
      address: editedProject.address,
      description: editedProject.description,
      consumption: editedProject.consumption,
      percentage: editedProject.percentage
    });

    if (success) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 1
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}
      >
        Edit Project
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project Name"
                value={editedProject.name}
                onChange={(e) =>
                  setEditedProject({ ...editedProject, name: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                value={editedProject.address}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    address: e.target.value
                  })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Yearly Consumption (kWh)"
                value={editedProject.consumption}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    consumption: e.target.value
                  })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Escalator Percentage"
                value={editedProject.percentage}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    percentage: e.target.value
                  })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={editedProject.description}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    description: e.target.value
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rate</InputLabel>
                <Select
                  value={editedProject.selectedRate}
                  label="Rate"
                  onChange={(e) =>
                    setEditedProject({
                      ...editedProject,
                      selectedRate: e.target.value
                    })
                  }
                  disabled={loadingRates}
                >
                  {loadingRates ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading rates...
                    </MenuItem>
                  ) : (
                    availableRates.map((rate) => (
                      <MenuItem
                        key={rate.uniqueId}
                        value={rate.uniqueId}
                      >
                        {rate.uniqueId}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={disabled || loadingRates}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
