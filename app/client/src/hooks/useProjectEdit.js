import { useState, useEffect } from 'react';

export const useProjectEdit = ({ project, calculateRates, selectRate, initialRates = [], onSave, onClose }) => {
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
          uniqueId: `${rate.rate_name}`
        })));
      } else {
        const fetchRates = async () => {
          setLoadingRates(true);
          try {
            const rates = await calculateRates(project.id);
            setAvailableRates(rates.map(rate => ({
              ...rate,
              uniqueId: `${rate.rate_name}`
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

  const handleInputChange = (field) => (event) => {
    setEditedProject({ ...editedProject, [field]: event.target.value });
  };

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

  return {
    editedProject,
    availableRates,
    loadingRates,
    handleInputChange,
    handleSubmit
  };
};
