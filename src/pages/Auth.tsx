
import React, { useState } from 'react';
import { BarChart, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const isEmail = (input: string) => /\S+@\S+\.\S+/.test(input);

  const validateForm = () => {
    if (isSignUp) {
      if (!formData.email || !formData.username || !formData.password) {
        setError('Please fill in all required fields');
        return false;
      }
      
      if (!isEmail(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }

      if (formData.username.length < 3) {
        setError('Username must be at least 3 characters long');
        return false;
      }
    } else {
      if (!formData.emailOrUsername || !formData.password) {
        setError('Please fill in all required fields');
        return false;
      }
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password, formData.username);
        
        if (error) {
          if (error.message.includes('User already registered')) {
            setError('An account with this email already exists. Please sign in instead.');
          } else {
            setError(error.message || 'An error occurred during sign up. Please try again.');
          }
        } else {
          // Sign up successful, user should be automatically signed in
          navigate('/dashboard');
        }
      } else {
        // For sign in, determine if input is email or username
        const loginIdentifier = formData.emailOrUsername;
        const { error } = await signIn(loginIdentifier, formData.password);
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Invalid credentials. Please check your email/username and password.');
          } else {
            setError(error.message || 'An error occurred during sign in. Please try again.');
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <BarChart className="h-12 w-12 text-teal-600" />
            <span className="text-2xl font-bold text-gray-900">GoCarbonTracker</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp 
              ? 'Sign up to start tracking your carbon emissions' 
              : 'Sign in to your account to continue'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isSignUp ? 'Sign up' : 'Sign in'}</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp ? (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Enter your email"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <Input
                      id="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      placeholder="Choose a username"
                      className="w-full"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700 mb-2">
                    Email or Username
                  </label>
                  <Input
                    id="emailOrUsername"
                    type="text"
                    required
                    value={formData.emailOrUsername}
                    onChange={(e) => setFormData({...formData, emailOrUsername: e.target.value})}
                    placeholder="Enter your email or username"
                    className="w-full"
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter your password"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Confirm your password"
                    className="w-full"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={loading}
              >
                {loading ? 'Processing...' : (isSignUp ? 'Sign up' : 'Sign in')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setFormData({ 
                      emailOrUsername: '', 
                      email: '', 
                      username: '', 
                      password: '', 
                      confirmPassword: '' 
                    });
                  }}
                  className="text-teal-600 hover:text-teal-500 font-medium"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
