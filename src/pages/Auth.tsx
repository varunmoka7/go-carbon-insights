import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, Github, Leaf, Droplets } from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { sanitizeInput, validateEmail, validatePassword, validateUsername } from '@/utils/securityValidation';
import Logo from '@/components/ui/Logo';
import RainAnimation from '@/components/ui/RainAnimation';
import rainforestBg from '@/assets/rainforest-bg.jpg';
import '@/styles/rain-animation.css';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, resetPassword, signInWithGoogle, signInWithGitHub } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const redirectMessage = location.state?.message;
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  // Handle email verification on page load
  useEffect(() => {
    const handleEmailVerification = async () => {
      const token = searchParams.get('token_hash');
      const type = searchParams.get('type');
      
      if (token && type === 'email') {
        toast({
          title: "Email Verified Successfully",
          description: "Your email has been verified! You can now sign in to your account.",
        });
        // Clear URL parameters and switch to sign in mode
        navigate('/auth', { replace: true });
        setIsSignUp(false);
      }
      
      // Handle various verification states
      if (searchParams.get('verified') === 'true') {
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified. You can now sign in.",
        });
        setIsSignUp(false);
      }
      
      if (searchParams.get('error')) {
        const errorMsg = searchParams.get('error_description') || 'Email verification failed';
        setError(errorMsg);
        toast({
          title: "Verification Error",
          description: errorMsg,
          variant: "destructive",
        });
      }

      // Handle confirmation errors
      if (searchParams.get('error_code') === 'email_not_confirmed') {
        toast({
          title: "Email Not Verified",
          description: "Please check your email and click the verification link before signing in.",
          variant: "destructive",
        });
        setIsSignUp(false);
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate, toast]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      // Handle both string paths and location objects from PrivateRoute
      const from = location.state?.from;
      let intendedDestination = '/dashboard';
      
      if (typeof from === 'string') {
        intendedDestination = from;
      } else if (from && from.pathname) {
        intendedDestination = from.pathname;
      }
      
      console.log('Auth redirect:', { from, intendedDestination, locationState: location.state });
      navigate(intendedDestination);
    }
  }, [user, navigate, location.state]);

  const handleInputChange = (field: string, value: string) => {
    // Sanitize input as user types
    const sanitized = sanitizeInput(value);
    setFormData(prev => ({
      ...prev,
      [field]: sanitized
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (isSignUp) {
      if (!formData.email || !formData.username || !formData.password) {
        setError('Please fill in all required fields');
        return false;
      }
      
      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }

      const usernameValidation = validateUsername(formData.username);
      if (!usernameValidation.isValid) {
        setError(usernameValidation.message || 'Invalid username format');
        return false;
      }

      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.message || 'Password does not meet requirements');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    } else if (isForgotPassword) {
      if (!formData.email) {
        setError('Please enter your email address');
        return false;
      }
      
      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
    } else {
      if (!formData.emailOrUsername || !formData.password) {
        setError('Please fill in all required fields');
        return false;
      }
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
        const result = await signUp(formData.email, formData.password, formData.username);
        
        if (result.error) {
          setError(result.error.message || 'An error occurred during sign up. Please try again.');
        } else if (result.requiresVerification) {
          // Email verification required
          toast({
            title: "Registration Successful!",
            description: result.message || "Please check your email and click the verification link to complete registration.",
          });
          setError(''); // Clear any previous errors
          // Clear form data
          setFormData({
            emailOrUsername: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: ''
          });
          setIsSignUp(false); // Switch to sign-in view
          
          // Show success message on the form
          setError('Registration successful! Please check your email for a verification link.');
        } else {
          // Immediate success (no verification required)
          const intendedDestination = location.state?.from === '/community' ? 'community' : 'dashboard';
          toast({
            title: "Account Created Successfully",
            description: `Welcome to GoCarbonTracker! Redirecting to ${intendedDestination}...`,
          });
          setError(''); // Clear any previous errors
          // Clear form data
          setFormData({
            emailOrUsername: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: ''
          });
          setIsSignUp(false); // Switch to sign-in view
          // The redirect will happen automatically via the useEffect when user state updates
        }
      } else if (isForgotPassword) {
        const { error } = await resetPassword(formData.email);
        
        if (error) {
          setError(error.message || 'An error occurred while sending the reset email. Please try again.');
        } else {
          toast({
            title: "Password Reset Email Sent",
            description: "Check your email for instructions to reset your password.",
          });
          // Switch back to sign in mode after successful reset request
          setIsForgotPassword(false);
          resetForm();
        }
      } else {
        const { error } = await signIn(formData.emailOrUsername, formData.password);
        
        if (error) {
          if (error.message?.includes('email_not_confirmed')) {
            setError('Please verify your email address before signing in. Check your inbox for the verification link.');
          } else {
            setError(error.message || 'An error occurred during sign in. Please try again.');
          }
        } else {
          // Successful sign in - redirect will be handled by useEffect when user state updates
          console.log('Sign in successful, redirect will be handled by useEffect');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      emailOrUsername: '', 
      email: '', 
      username: '', 
      password: '', 
      confirmPassword: '' 
    });
    setError('');
  };

  const handleModeSwitch = (mode: 'signIn' | 'signUp' | 'forgotPassword') => {
    setIsSignUp(mode === 'signUp');
    setIsForgotPassword(mode === 'forgotPassword');
    resetForm();
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        setError(error.message || 'Failed to sign in with Google. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred during Google sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      const { error } = await signInWithGitHub();
      
      if (error) {
        setError(error.message || 'Failed to sign in with GitHub. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred during GitHub sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, 
          rgba(26, 76, 46, 0.8) 0%,
          rgba(45, 90, 61, 0.7) 25%,
          rgba(30, 58, 43, 0.8) 50%,
          rgba(15, 43, 26, 0.9) 75%,
          rgba(10, 31, 18, 0.9) 100%
        ), url(${rainforestBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Rain Animation */}
      <RainAnimation />
      
      {/* Content */}
      <div className="max-w-md w-full space-y-8 relative z-20">
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <Leaf className="h-8 w-8 text-green-100" />
            </div>
            <span className="text-3xl font-bold text-white rainforest-form-header drop-shadow-lg">
              GoCarbonTracker
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">
            {isSignUp ? 'Create your account' : isForgotPassword ? 'Reset your password' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-green-100 drop-shadow-sm">
            {isSignUp 
              ? 'Join us in tracking carbon emissions for a sustainable future' 
              : isForgotPassword 
                ? 'Enter your email address to receive a password reset link'
                : 'Continue your journey towards carbon neutrality'
            }
          </p>
        </div>

        <Card className="rainforest-form border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
              <Droplets className="h-5 w-5 text-green-600" />
              {isSignUp ? 'Sign up' : isForgotPassword ? 'Reset Password' : 'Sign in'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {redirectMessage && (
              <Alert className="mb-4" variant="default">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{redirectMessage}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isForgotPassword && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-medium transition-all duration-200 hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGitHubSignIn}
                    disabled={loading}
                    aria-label="Continue with GitHub"
                    className="w-full bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-3 focus:ring-primary-focus"
                  >
                    <Github className="w-5 h-5 mr-2" aria-hidden="true" />
                    Continue with GitHub
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isForgotPassword ? (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full focus:ring-3 focus:ring-primary-focus"
                    maxLength={100}
                  />
                </div>
              ) : isSignUp ? (
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
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className="w-full focus:ring-3 focus:ring-primary-focus"
                      maxLength={100}
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
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Choose a username"
                      className="w-full focus:ring-3 focus:ring-primary-focus"
                      maxLength={20}
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
                    onChange={(e) => handleInputChange('emailOrUsername', e.target.value)}
                    placeholder="Enter your email or username"
                    className="w-full focus:ring-3 focus:ring-primary-focus"
                    maxLength={100}
                  />
                </div>
              )}

              {!isForgotPassword && (
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
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pr-10 focus:ring-3 focus:ring-primary-focus"
                      maxLength={128}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-3 focus:ring-primary-focus rounded-md"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {isSignUp && (
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters with uppercase, lowercase, and number
                    </p>
                  )}
                </div>
              )}

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
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full"
                    maxLength={128}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading}
              >
                {loading ? 'Processing...' : (isSignUp ? 'Sign up' : isForgotPassword ? 'Send Reset Email' : 'Sign in')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              {isForgotPassword ? (
                <p className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('signIn')}
                    className="text-teal-600 hover:text-teal-500 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch(isSignUp ? 'signIn' : 'signUp')}
                      className="text-teal-600 hover:text-teal-500 font-medium"
                    >
                      {isSignUp ? 'Sign in' : 'Sign up'}
                    </button>
                  </p>
                  {!isSignUp && (
                    <p className="text-sm text-gray-600 mt-2">
                      <button
                        type="button"
                        onClick={() => handleModeSwitch('forgotPassword')}
                        className="text-teal-600 hover:text-teal-500 font-medium"
                      >
                        Forgot your password?
                      </button>
                    </p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;