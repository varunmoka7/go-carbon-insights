import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { sanitizeInput, validatePassword } from '@/utils/securityValidation';
import Logo from '@/components/ui/Logo';

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { updateUserPassword, loading, user } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const checkPasswordStrength = (password: string) => {
    const strength = {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    setPasswordStrength(strength);
    return strength;
  };

  const getPasswordStrengthScore = () => {
    const { hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar } = passwordStrength;
    let score = 0;
    if (hasMinLength) score++;
    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;
    return score;
  };

  const getPasswordStrengthColor = () => {
    const score = getPasswordStrengthScore();
    if (score < 3) return 'bg-red-500';
    if (score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    const score = getPasswordStrengthScore();
    if (score < 3) return 'Weak';
    if (score < 4) return 'Fair';
    return 'Strong';
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitized = sanitizeInput(value);
    setFormData(prev => ({
      ...prev,
      [field]: sanitized
    }));
    
    if (field === 'password') {
      checkPasswordStrength(sanitized);
    }
    
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
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

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    try {
      const { error } = await updateUserPassword(formData.password);
      
      if (error) {
        setError(error.message || 'An error occurred while updating your password. Please try again.');
        toast({
          title: "Error",
          description: error.message || 'Failed to update password',
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password Updated Successfully",
          description: "Your password has been updated. Please sign in with your new password.",
        });
        
        // Redirect to login page after successful password update
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
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

  const PasswordStrengthIndicator = () => {
    const score = getPasswordStrengthScore();
    const strengthColor = getPasswordStrengthColor();
    const strengthText = getPasswordStrengthText();
    
    return (
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Password strength:</span>
          <span className={`text-sm font-medium ${
            score < 3 ? 'text-red-600' : score < 4 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {strengthText}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${strengthColor}`}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 space-y-1">
          <div className={`flex items-center gap-2 ${passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-400'}`}>
            {passwordStrength.hasMinLength ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 border border-gray-300 rounded-full" />}
            At least 8 characters
          </div>
          <div className={`flex items-center gap-2 ${passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
            {passwordStrength.hasUpperCase ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 border border-gray-300 rounded-full" />}
            One uppercase letter
          </div>
          <div className={`flex items-center gap-2 ${passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`}>
            {passwordStrength.hasLowerCase ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 border border-gray-300 rounded-full" />}
            One lowercase letter
          </div>
          <div className={`flex items-center gap-2 ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
            {passwordStrength.hasNumber ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 border border-gray-300 rounded-full" />}
            One number
          </div>
          <div className={`flex items-center gap-2 ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
            {passwordStrength.hasSpecialChar ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 border border-gray-300 rounded-full" />}
            One special character
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            <Logo size="large" className="h-12 w-auto mb-4" />
            <span className="text-2xl font-bold text-gray-900">GoCarbonTracker</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Update Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password to secure your account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Set New Password
            </CardTitle>
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full pr-10"
                    maxLength={128}
                    disabled={loading}
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
                {formData.password && <PasswordStrengthIndicator />}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full pr-10"
                    maxLength={128}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={loading || getPasswordStrengthScore() < 3}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Want to go back?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/auth')}
                  className="text-teal-600 hover:text-teal-500 font-medium"
                >
                  Return to Sign In
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdatePassword;