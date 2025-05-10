import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useNavigate } from 'react-router-dom';

interface AdminLoginFormData {
  passKey: string;
}

export function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<AdminLoginFormData>();

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      await adminLogin(data.passKey);
      navigate('/admin/dashboard');
    } catch (error) {
      setError('passKey', { 
        type: 'manual',
        message: 'Invalid admin key'
      });
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
        <CardDescription>Enter admin pass key to access dashboard</CardDescription>
      </CardHeader>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Admin Pass Key"
              {...register('passKey', { required: 'Pass key is required' })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
            />
            {errors.passKey && (
              <span className="text-sm text-red-500">{errors.passKey.message}</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate('/login')}>
            Back to Login
          </Button>
          <Button type="submit">Access Dashboard</Button>
        </CardFooter>
      </form>
    </Card>
  );
}