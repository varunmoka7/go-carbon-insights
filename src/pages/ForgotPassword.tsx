import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { sanitizeInput, validateEmail } from '@/utils/securityValidation';
import Logo from '@/components/ui/Logo';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { sendPasswordResetEmail, loading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (value: string) => {
    const sanitized = sanitizeInput(value);
    setEmail(sanitized);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      const { error } = await sendPasswordResetEmail(email);
      
      if (error) {
        setError(error.message || 'An error occurred while sending the reset email. Please try again.');
        toast({
          title: "Error",
          description: error.message || 'Failed to send password reset email',
          variant: "destructive",
        });
      } else {
        setIsSubmitted(true);
        toast({
          title: "Password Reset Email Sent",
          description: "Check your email for instructions to reset your password.",
        });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBackToSignIn = () => {
    navigate('/auth');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex flex-col items-center mb-6">
              <Logo size="large" className="h-12 w-auto mb-4" />
              <span className="text-2xl font-bold text-gray-900">GoCarbonTracker</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Check Your Email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a password reset link to your email address
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email Sent!</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>Didn't receive the email? Check your spam folder or</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail('');
                    }}
                    className="text-teal-600 hover:text-teal-500 font-medium"
                  >
                    try again
                  </button>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToSignIn}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            <Logo size="large" className="h-12 w-auto mb-4" />
            <span className="text-2xl font-bold text-gray-900">GoCarbonTracker</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full"
                  maxLength={100}
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={handleBackToSignIn}
                  className="text-teal-600 hover:text-teal-500 font-medium"
                >
                  Back to Sign In
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;