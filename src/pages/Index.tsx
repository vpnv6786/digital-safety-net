
import React, { useState } from 'react';
import HomePage from '@/components/HomePage';
import SearchResults from '@/components/SearchResults';
import ReportForm from '@/components/ReportForm';

type AppState = 'home' | 'search-results' | 'report-form';

const Index = () => {
  const [currentView, setCurrentView] = useState<AppState>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchRisk, setSearchRisk] = useState<'safe' | 'suspicious' | 'dangerous'>('safe');

  // Mock search function - in real app this would call API
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Mock risk assessment based on query content
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('0987654321') || lowerQuery.includes('fake-bank') || lowerQuery.includes('danger')) {
      setSearchRisk('dangerous');
    } else if (lowerQuery.includes('0123456789') || lowerQuery.includes('suspicious')) {
      setSearchRisk('suspicious');
    } else {
      setSearchRisk('safe');
    }
    
    setCurrentView('search-results');
  };

  const goToReportForm = () => {
    setCurrentView('report-form');
  };

  const goHome = () => {
    setCurrentView('home');
    setSearchQuery('');
  };

  // Pass search handler to HomePage
  React.useEffect(() => {
    const handleGlobalSearch = (event: CustomEvent) => {
      handleSearch(event.detail.query);
    };

    window.addEventListener('vbm-search' as any, handleGlobalSearch);
    
    return () => {
      window.removeEventListener('vbm-search' as any, handleGlobalSearch);
    };
  }, []);

  switch (currentView) {
    case 'search-results':
      return (
        <SearchResults
          query={searchQuery}
          riskLevel={searchRisk}
          onBack={goHome}
        />
      );
    
    case 'report-form':
      return (
        <ReportForm
          onBack={goHome}
        />
      );
    
    default:
      return (
        <HomePage
          onSearch={handleSearch}
          onReport={goToReportForm}
        />
      );
  }
};

export default Index;
