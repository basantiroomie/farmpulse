import React from 'react';
import { LoginForm } from '@/components/LoginForm';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-600">Choose your login method</p>
      </div>
      
      <div className="space-y-4">
        <LoginForm />
        
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/admin-login')}>
            Admin Login
          </Button>
          <Button variant="outline" onClick={() => navigate('/signup')}>
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}