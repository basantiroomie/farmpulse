import React from 'react';
import { AdminLogin } from '@/components/AdminLogin';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
        <p className="text-gray-600">Enter your admin credentials</p>
      </div>
      
      <AdminLogin />
    </div>
  );
}