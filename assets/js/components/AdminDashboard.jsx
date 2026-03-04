import React, { useState, useEffect } from 'react';

export const AdminContext = React.createContext();

/**
 * Composant parent qui gère l'état global du dashboard
 */
export function AdminDashboard({ children }) {
  const [activeTab, setActiveTab] = useState('projects');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Auto-dismiss success messages after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Auto-dismiss error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const contextValue = {
    activeTab,
    setActiveTab,
    loading,
    setLoading,
    error,
    setError,
    success,
    setSuccess,
    editingId,
    setEditingId,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      <div className="admin-dashboard">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError(null)}
            />
          </div>
        )}
        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {success}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setSuccess(null)}
            />
          </div>
        )}
        {children}
      </div>
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = React.useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminDashboard');
  }
  return context;
}
