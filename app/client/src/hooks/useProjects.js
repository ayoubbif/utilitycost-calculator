import { useState, useEffect } from 'react';
import { fetchWithCSRF } from '../utils/api';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetchWithCSRF('/api/projects/');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      setLoading(true);
      setError(null);
      await fetchWithCSRF('/api/projects/', {
        method: 'POST',
        body: JSON.stringify(projectData)
      });
      await fetchProjects();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId, projectData) => {
    try {
      setLoading(true);
      setError(null);
      await fetchWithCSRF(`/api/projects/${projectId}/`, {
        method: 'PUT',
        body: JSON.stringify(projectData)
      });
      await fetchProjects();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const calculateRates = async (projectId) => {
    try {
      setLoading(true);
      const response = await fetchWithCSRF(
        `/api/projects/${projectId}/calculate_rates/`,
        {
          method: 'POST'
        }
      );
      const data = await response.json();
      return data.map((rate, index) => ({
        ...rate,
        uniqueId: `${rate.rate_name}-${rate.utility}-${index}`
      }));
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const selectRate = async (projectId, rateData) => {
    try {
      setLoading(true);
      await fetchWithCSRF(`/api/projects/${projectId}/select_rate/`, {
        method: 'POST',
        body: JSON.stringify(rateData)
      });
      await fetchProjects();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    setError,
    createProject,
    updateProject,
    calculateRates,
    selectRate
  };
};
