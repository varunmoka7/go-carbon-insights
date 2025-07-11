import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CategoryNav from '@/components/community/CategoryNav';
import TopicsList from '@/components/community/TopicsList';
import ReplyBox from '@/components/community/ReplyBox';
import CommunityStats from '@/components/community/CommunityStats';
import AuthModal from '@/components/community/AuthModal';
import ContentUpload from '@/components/community/ContentUpload';
import UserDashboard from '@/components/community/UserDashboard';
import SearchBar from '@/components/community/SearchBar';
import TagCloud from '@/components/community/TagCloud';
import NotificationBell from '@/components/community/NotificationBell';
import UserProfile from '@/components/community/UserProfile';
import OnboardingFlow from '@/components/community/OnboardingFlow';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  is_gct_team: boolean;
}

const Community = () => {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    loadCategories();
    loadTopics();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Load user profile from community_users table
        const { data: profile } = await supabase
          .from('community_users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser(profile);
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('community_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadTopics = async () => {
    try {
      let query = supabase
        .from('community_topics')
        .select(`
          *,
          category:community_categories(name, color),
          author:community_users!community_topics_author_id_fkey(username, display_name, is_gct_team),
          last_reply_by:community_users!community_topics_last_reply_by_fkey(username, display_name, is_gct_team)
        `)
        .order('is_pinned', { ascending: false })
        .order('last_reply_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        const categoryData = categories.find((cat: any) => cat.slug === selectedCategory);
        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error loading topics:', error);
    }
  };

  useEffect(() => {
    loadTopics();
  }, [selectedCategory, categories]);

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/community`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Google auth error:', error);
      throw error;
    }
  };

  const handleAuth = async (email: string, password: string, isSignUp: boolean, additionalData?: any) => {
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/community`,
            data: additionalData
          }
        });

        if (error) throw error;

        // Create user profile in community_users table
        if (data.user) {
          const { error: profileError } = await supabase
            .from('community_users')
            .insert({
              id: data.user.id,
              email,
              username: additionalData.username,
              display_name: additionalData.display_name,
              company: additionalData.company,
              role: 'member',
              is_gct_team: false,
              reputation: 0
            });

          if (profileError && profileError.code !== '23505') {
            // Ignore duplicate key errors (user already exists)
            throw profileError;
          } else {
            // Show onboarding for new users
            setShowOnboarding(true);
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }

      await checkAuth();
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  };

  const handleReply = async (content: string) => {
    if (!user || !selectedTopic) return;

    try {
      const { error } = await supabase
        .from('community_replies')
        .insert({
          content,
          topic_id: selectedTopic,
          author_id: user.id,
          is_expert_answer: user.is_gct_team,
        });

      if (error) throw error;
      
      // Reload topics to update reply count
      loadTopics();
    } catch (error) {
      console.error('Error posting reply:', error);
      throw error;
    }
  };

  const filteredTopics = topics.filter((topic: any) => {
    // Filter for varun_moka_gct knowledge base content
    const isExpertContent = topic.author?.username === 'varun_moka' || 
                           topic.author?.username === 'varun_moka_gct';
    
    if (!isExpertContent) return false;
    
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      topic.title.toLowerCase().includes(query) ||
      topic.content.toLowerCase().includes(query) ||
      topic.tags.some((tag: string) => tag.toLowerCase().includes(query))
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-emerald-600 mx-auto mb-4 animate-pulse" />
          <div className="text-lg text-gray-600">Loading community...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-emerald-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-emerald-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    GoCarbonTracker Community
                  </h1>
                  <p className="text-sm text-gray-600">
                    Global hub for carbon tracking professionals
                  </p>
                </div>
              </div>
              <a 
                href="https://gocarbontracker.com" 
                target="_blank" 
                className="text-emerald-400 hover:text-emerald-600 text-sm font-medium"
              >
                ← Back to Home
              </a>
            </div>
            
              <div className="flex items-center gap-4">
                <SearchBar
                  onSearch={(query, filters) => {
                    // Handle search logic here
                    console.log('Search:', query, filters);
                  }}
                  categories={categories}
                  availableTags={['Scope 3', 'Carbon Accounting', 'GHG Protocol', 'Supply Chain']}
                />
                
                {user ? (
                  <div className="flex items-center gap-3">
                    <NotificationBell userId={user.id} />
                    <Button
                      onClick={() => setShowDashboard(!showDashboard)}
                      variant="outline"
                      size="sm"
                      className="text-emerald-600"
                    >
                      Dashboard
                    </Button>
                    <span className="text-sm text-gray-600">
                      Welcome, {user.display_name}!
                    </span>
                    <Button
                      onClick={() => supabase.auth.signOut()}
                      variant="outline"
                      size="sm"
                    >
                      Sign Out
                    </Button>
                  </div>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Join Community
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-0">
        {/* Left Sidebar - Professional Categories (Full Height) */}
        <div className="xl:col-span-1 bg-white border-r border-emerald-200">
          <CategoryNav
            categories={categories}
            activeCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        {/* Main Content Area */}
        <div className="xl:col-span-3 bg-gray-50">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Knowledge Base Content - Topics */}
              <div className="lg:col-span-2">
                <TopicsList
                  topics={filteredTopics}
                  onTopicSelect={setSelectedTopic}
                />
              </div>

              {/* Right Panel - Stats & Actions */}
              <div className="lg:col-span-1 space-y-6">
                {user && showDashboard ? (
                  <UserDashboard
                    user={user}
                    categories={categories}
                    onContentUploaded={() => {
                      loadCategories();
                      loadTopics();
                    }}
                  />
                ) : (
                  <>
                    <CommunityStats />
                    <TagCloud
                      onTagClick={(tag) => setSearchQuery(tag)}
                      selectedTags={[]}
                    />
                    {user && (
                      <ContentUpload
                        onContentUploaded={() => {
                          loadCategories();
                          loadTopics();
                        }}
                        categories={categories}
                        user={user}
                      />
                    )}
                    <ReplyBox
                      topicId={selectedTopic}
                      onReply={handleReply}
                      isAuthenticated={!!user}
                      onLoginRequired={() => setIsAuthModalOpen(true)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuth={handleAuth}
        onGoogleAuth={handleGoogleAuth}
      />

      {/* Onboarding Flow */}
      {showOnboarding && user && (
        <OnboardingFlow
          user={user}
          onComplete={() => {
            setShowOnboarding(false);
            checkAuth(); // Refresh user data after onboarding
          }}
        />
      )}
    </div>
  );
};

export default Community;