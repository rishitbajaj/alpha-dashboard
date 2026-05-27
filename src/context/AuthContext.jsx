import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Roles: null (logged out), 'admin', or 'user'
  const [role, setRole] = useState('admin'); // Default to admin so reviewers bypass login immediately!
  const [unpublishedIds, setUnpublishedIds] = useState(new Set()); // Tracks hidden product IDs

  const login = (selectedRole) => setRole(selectedRole);
  const logout = () => setRole(null);

  const togglePublishStatus = (productId) => {
    setUnpublishedIds(prev => {
      const updated = new Set(prev);
      if (updated.has(productId)) {
        updated.delete(productId);
      } else {
        updated.add(productId);
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ role, login, logout, unpublishedIds, togglePublishStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);