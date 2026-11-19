import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import { getMatches, resetDemo } from './services/api';
import toast from 'react-hot-toast';

function App() {
  const [matchesCount, setMatchesCount] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  // Poll or check matches count for navbar badge
  const updateMatchesCount = useCallback(async () => {
    try {
      const data = await getMatches();
      if (data.success) {
        setMatchesCount(data.matches?.length || 0);
      }
    } catch {
      // Ignore background badge error
    }
  }, []);

  useEffect(() => {
    updateMatchesCount();
    const interval = setInterval(updateMatchesCount, 8000);
    return () => clearInterval(interval);
  }, [updateMatchesCount]);

  const handleResetDemo = async () => {
    if (isResetting) return;
    setIsResetting(true);
    try {
      const res = await resetDemo();
      if (res.success) {
        toast.success('Demo state reset! All profiles are ready to discover.', {
          icon: '🔄',
        });
        setMatchesCount(0);
      }
    } catch (err) {
      toast.error('Failed to reset demo state');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2FA] text-[#191722] font-sans">
      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#191722',
            border: '2px solid #191722',
            boxShadow: '4px 4px 0px #191722',
            borderRadius: '16px',
            fontWeight: '600',
            fontSize: '13px',
          },
        }}
      />

      {/* Desktop / Tablet Top Navigation */}
      <Navbar
        onReset={handleResetDemo}
        isResetting={isResetting}
        matchesCount={matchesCount}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 flex flex-col pb-20 md:pb-8">
        <Routes>
          <Route path="/" element={<Navigate to="/discover" replace />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/discover"
            element={
              <Discover
                onReset={handleResetDemo}
                isResetting={isResetting}
              />
            }
          />
          <Route path="/matches" element={<Matches />} />
          <Route path="*" element={<Navigate to="/discover" replace />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav matchesCount={matchesCount} />
    </div>
  );
}

export default App;
