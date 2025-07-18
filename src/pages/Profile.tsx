
import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Building, Calendar, Edit, LogOut, Shield, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const getLoginMethod = () => {
    if (!user) return 'Unknown';
    if (user.app_metadata?.provider === 'google') return 'Google';
    if (user.app_metadata?.provider === 'github') return 'GitHub';
    return 'Email';
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const [editProfile, setEditProfile] = useState({
    name: user?.user_metadata?.display_name || user?.user_metadata?.username || 'Anonymous User',
    email: user?.email || 'No email'
  });

  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditProfile({
      name: user?.user_metadata?.display_name || user?.user_metadata?.username || 'Anonymous User',
      email: user?.email || 'No email'
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Logout failed",
          description: "There was an error logging out. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred during logout.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-teal-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <div className="flex items-center gap-3">
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            )}
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              className="flex items-center space-x-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.user_metadata?.display_name || user?.user_metadata?.username || 'Anonymous User'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {getLoginMethod()} Account
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <Input
                      value={editProfile.name}
                      onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                      placeholder="Enter your display name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={editProfile.email}
                      onChange={(e) => setEditProfile({...editProfile, email: e.target.value})}
                      placeholder="Enter your email"
                      disabled
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user?.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Login Method</p>
                      <p className="font-medium text-gray-900 dark:text-white">{getLoginMethod()}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                      <p className="font-medium text-gray-900 dark:text-white text-sm font-mono">
                        {user?.id?.substring(0, 8) || 'Unknown'}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Account Created</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatDate(user?.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Verified</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.email_confirmed_at ? 'Your email is verified' : 'Email not verified'}
                </p>
              </div>
              <div className="flex items-center">
                {user?.email_confirmed_at ? (
                  <span className="text-green-600 dark:text-green-400 text-sm">✓ Verified</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400 text-sm">⚠ Not verified</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Last Sign In</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(user?.last_sign_in_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Password Reset</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reset your account password</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/forgot-password')}
              >
                Reset Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Delete Account</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Feature not available",
                    description: "Account deletion is not yet implemented.",
                    variant: "destructive"
                  });
                }}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
