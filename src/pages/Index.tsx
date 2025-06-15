import React, { useState } from 'react';
import HomePage from '@/components/HomePage';
import SearchResults from '@/components/SearchResults';
import ReportForm from '@/components/ReportForm';

type AppState = 'home' | 'search-results' | 'report-form';

const Index = () => {
  const [currentView, setCurrentView] = useState<AppState>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);

  // Enhanced search handler that accepts AI results
  const handleSearch = (query: string, result?: any) => {
    setSearchQuery(query);
    
    if (result) {
      // Use AI-enhanced result
      setSearchResult(result);
    } else {
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
          riskLevel={searchResult?.riskLevel || 'safe'}
          searchResult={searchResult}
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
