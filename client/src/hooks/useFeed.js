import { useState, useEffect, useCallback } from 'react';
import { getFeed } from '../services/api';
import toast from 'react-hot-toast';

export const useFeed = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeed();
      if (data.success) {
        setProfiles(data.profiles || []);
      } else {
        throw new Error(data.message || 'Failed to load feed');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Unable to connect to server';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const removeTopProfile = useCallback(() => {
    setProfiles((prev) => prev.slice(1));
  }, []);

  return {
    profiles,
    currentProfile: profiles[0] || null,
    nextProfile: profiles[1] || null,
    loading,
    error,
    refetch: fetchProfiles,
    removeTopProfile,
  };
};
