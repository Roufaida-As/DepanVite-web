// src/layouts/AuthLayout.jsx
import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
      {children}
    </div>
  );
}
