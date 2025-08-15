"use client";

import React, { useState, useEffect } from 'react';

export default function AuthDebug() {
  const [tokens, setTokens] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
    user: string | null;
    adminToken: string | null;
    adminUser: string | null;
  }>({
    accessToken: null,
    refreshToken: null,
    user: null,
    adminToken: null,
    adminUser: null,
  });

  useEffect(() => {
    const updateTokens = () => {
      setTokens({
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        user: localStorage.getItem('user'),
        adminToken: localStorage.getItem('adminToken'),
        adminUser: localStorage.getItem('adminUser'),
      });
    };

    updateTokens();
    window.addEventListener('storage', updateTokens);
    
    return () => window.removeEventListener('storage', updateTokens);
  }, []);

  const clearAllTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setTokens({
      accessToken: null,
      refreshToken: null,
      user: null,
      adminToken: null,
      adminUser: null,
    });
  };

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg max-w-sm">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Auth Debug</h3>
      <div className="space-y-1 text-xs">
        <div>
          <span className="text-gray-600 dark:text-gray-400">accessToken: </span>
          <span className={tokens.accessToken ? 'text-green-600' : 'text-red-600'}>
            {tokens.accessToken ? '✓ Present' : '✗ Missing'}
          </span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">refreshToken: </span>
          <span className={tokens.refreshToken ? 'text-green-600' : 'text-red-600'}>
            {tokens.refreshToken ? '✓ Present' : '✗ Missing'}
          </span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">user: </span>
          <span className={tokens.user ? 'text-green-600' : 'text-red-600'}>
            {tokens.user ? '✓ Present' : '✗ Missing'}
          </span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">adminToken: </span>
          <span className={tokens.adminToken ? 'text-green-600' : 'text-red-600'}>
            {tokens.adminToken ? '✓ Present' : '✗ Missing'}
          </span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">adminUser: </span>
          <span className={tokens.adminUser ? 'text-green-600' : 'text-red-600'}>
            {tokens.adminUser ? '✓ Present' : '✗ Missing'}
          </span>
        </div>
      </div>
      <button
        onClick={clearAllTokens}
        className="mt-2 w-full px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
      >
        Clear All Tokens
      </button>
    </div>
  );
}
