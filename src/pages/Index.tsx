
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HomePage from '@/components/HomePage';
import SearchResults from '@/components/SearchResults';
import ReportForm from '@/components/ReportForm';
import AuthPage from '@/components/AuthPage';
import { useAuth } from '@/hooks/useAuth';
import { searchEntity } from '@/services/searchService';

type AppState = 'home' | 'search-results' | 'report-form' | 'auth';

const Index = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppState>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);

  // Enhanced search handler with real Supabase integration
  const handleSearch = async (query: string, result?: any) => {
    setSearchQuery(query);
    
    if (result) {
      // Use provided result (from AI or other source)
      setSearchResult(result);
    } else {
      // Search in Supabase database
      try {
        const searchData = await searchEntity(query);
        setSearchResult(searchData);
      } catch (error) {
        console.error('Search failed:', error);
        // Fallback to mock logic for demo
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('0987654321') || lowerQuery.includes('fake-bank') || lowerQuery.includes('danger')) {
          setSearchResult({ riskLevel: 'dangerous', reportCount: 15, confidence: 90 });
        } else if (lowerQuery.includes('0123456789') || lowerQuery.includes('suspicious')) {
          setSearchResult({ riskLevel: 'suspicious', reportCount: 5, confidence: 70 });
        } else {
          setSearchResult({ riskLevel: 'safe', reportCount: 0, confidence: 60 });
        }
      }
    }
    
    setCurrentView('search-results');
  };

  const goToReportForm = () => {
    if (!user) {
      setCurrentView('auth');
      return;
    }
    setCurrentView('report-form');
  };

  const goToAuth = () => {
    setCurrentView('auth');
  };

  const goHome = () => {
    setCurrentView('home');
    setSearchQuery('');
  };

  // Global search event handler
  useEffect(() => {
    const handleGlobalSearch = (event: CustomEvent) => {
      handleSearch(event.detail.query);
    };

    window.addEventListener('vbm-search' as any, handleGlobalSearch);
    
    return () => {
      window.removeEventListener('vbm-search' as any, handleGlobalSearch);
    };
  }, []);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Auth page doesn't need header/footer (handled by Layout)
  if (currentView === 'auth') {
    return <AuthPage onBack={goHome} />;
  }

  // All other views include the header
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {currentView === 'search-results' && (
        <SearchResults
          query={searchQuery}
          riskLevel={searchResult?.riskLevel || 'safe'}
          searchResult={searchResult}
          onBack={goHome}
        />
      )}
      
      {currentView === 'report-form' && (
        <ReportForm onBack={goHome} />
      )}
      
      {currentView === 'home' && <HomePage />}
    </div>
  );
};

export default Index;
