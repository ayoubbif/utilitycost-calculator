import React from 'react';
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
import { useProjectEdit } from '../hooks/useProjectEdit';

export const ProjectEditDialog = ({
  project,
  open,
  onClose,
  onSave,
  disabled,
  calculateRates,
  selectRate,
  initialRates
}) => {
  const {
    editedProject,
    availableRates,
    loadingRates,
    handleInputChange,
    handleSubmit
  } = useProjectEdit({
    project,
    calculateRates,
    selectRate,
    initialRates,
    onSave,
    onClose
  });

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
                onChange={handleInputChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                value={editedProject.address}
                onChange={handleInputChange('address')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Yearly Consumption (kWh)"
                value={editedProject.consumption}
                onChange={handleInputChange('consumption')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Escalator Percentage"
                value={editedProject.percentage}
                onChange={handleInputChange('percentage')}
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
                onChange={handleInputChange('description')}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rate</InputLabel>
                <Select
                  value={editedProject.selectedRate}
                  label="Rate"
                  onChange={handleInputChange('selectedRate')}
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
