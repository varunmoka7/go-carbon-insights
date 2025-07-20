import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Globe, 
  User, 
  Building2, 
  Camera, 
  MessageSquare, 
  Target,
  CheckCircle, 
  ChevronRight,
  Users,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useBadgeSystem } from '../hooks/useBadgeSystem';

interface OnboardingFlowProps {
  user: {
    id: string;
    email: string;
    username: string;
  };
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { awardBasicBadge } = useBadgeSystem();
  const [profileData, setProfileData] = useState({
    display_name: '',
    company: '',
    bio: '',
    avatar_file: null as File | null,
    avatar_url: ''
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleAvatarUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('community-avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('community-avatars')
        .getPublicUrl(fileName);

      setProfileData(prev => ({
        ...prev,
        avatar_url: urlData.publicUrl
      }));
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData(prev => ({ ...prev, avatar_file: file }));
      handleAvatarUpload(file);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('community_users')
        .update({
          display_name: profileData.display_name,
          company: profileData.company,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Award the Basic badge for completing onboarding
      try {
        await awardBasicBadge();
      } catch (badgeError) {
        console.error('Failed to award basic badge:', badgeError);
        // Don't fail onboarding if badge award fails
      }

      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <Globe className="h-10 w-10 text-emerald-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Welcome to GoCarbonTracker Community!
              </h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Join thousands of carbon accounting professionals working together to decarbonize supply chains and achieve net-zero targets.
              </p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-lg">
              <h3 className="font-semibold text-emerald-800 mb-3">What you'll find here:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-600" />
                  <span>Scope 3 Emissions Expertise</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  <span>GHG Protocol Guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" />
                  <span>Professional Networking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-emerald-600" />
                  <span>Industry Best Practices</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Up Your Profile</h2>
              <p className="text-gray-600">Tell the community about yourself and your expertise</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.avatar_url} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl font-semibold">
                      {getInitials(profileData.display_name || user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2 cursor-pointer shadow-lg"
                  >
                    <Camera className="h-4 w-4" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  placeholder="How you want to appear in the community"
                  value={profileData.display_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, display_name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="company"
                    placeholder="Your organization"
                    value={profileData.company}
                    onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Share your background in carbon accounting, sustainability, or climate tech..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore Our Categories</h2>
              <p className="text-gray-600">Discover discussions across different areas of carbon management</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'Scope 3 Emissions', color: 'emerald', icon: Target, desc: 'Supply chain and value chain emissions' },
                { name: 'GHG Protocol', color: 'blue', icon: BookOpen, desc: 'Standards and methodology discussions' },
                { name: 'ESG Reporting', color: 'purple', icon: MessageSquare, desc: 'Disclosure and compliance topics' },
                { name: 'Carbon Accounting', color: 'green', icon: Users, desc: 'Measurement and calculation methods' }
              ].map((category, index) => (
                <div key={index} className={`p-4 bg-${category.color}-50 border border-${category.color}-200 rounded-lg`}>
                  <div className="flex items-center gap-3 mb-2">
                    <category.icon className={`h-5 w-5 text-${category.color}-600`} />
                    <h3 className={`font-semibold text-${category.color}-800`}>{category.name}</h3>
                  </div>
                  <p className={`text-sm text-${category.color}-600`}>{category.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-amber-800">Pro Tip</h3>
              </div>
              <p className="text-sm text-amber-700">
                Start by exploring existing topics and contributing to discussions. Our community values detailed, 
                professional insights and practical solutions.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                You're All Set!
              </h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
                Welcome to the GoCarbonTracker Community. Your profile is complete and you're ready to start engaging with fellow professionals.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-lg border border-emerald-200">
              <h3 className="font-semibold text-emerald-800 mb-4">Next Steps:</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-emerald-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-emerald-800">Explore Topics</p>
                    <p className="text-sm text-emerald-600">Browse discussions and knowledge base</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-emerald-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-emerald-800">Share Your Insights</p>
                    <p className="text-sm text-emerald-600">Contribute to discussions and help others</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-emerald-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-emerald-800">Build Your Reputation</p>
                    <p className="text-sm text-emerald-600">Earn points through valuable contributions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="h-6 w-6 text-emerald-600" />
            <CardTitle className="text-xl font-bold text-gray-900">
              Community Onboarding
            </CardTitle>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={currentStep === 2 && !profileData.display_name.trim()}
                >
                  Next Step
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Completing...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;