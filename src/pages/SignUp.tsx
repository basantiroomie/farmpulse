import React from 'react';
import { SignUpForm } from '@/components/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-gray-600">Join us today</p>
      </div>
      
      <SignUpForm />
    </div>
  );
}