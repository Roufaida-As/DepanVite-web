// src/layouts/AuthLayout.jsx
import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-white">
      {children}
    </div>
  );
}
