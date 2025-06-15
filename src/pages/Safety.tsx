
import React from 'react';
import SafetyDashboard from '@/components/SafetyDashboard';
import { useLanguage } from '@/contexts/LanguageContext';

const Safety = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <SafetyDashboard />
    </div>
  );
};

export default Safety;
