
import React, { useState, useEffect } from 'react';
import { Key, Brain, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { initializeAI, isAIAvailable } from '@/services/aiService';
import { useLanguage } from '@/contexts/LanguageContext';

const AIKeyInput: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if API key is already stored
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      const success = initializeAI(storedKey);
      setIsConfigured(success);
    } else {
      setIsConfigured(isAIAvailable());
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      const success = initializeAI(apiKey);
      if (success) {
        localStorage.setItem('gemini_api_key', apiKey);
        setIsConfigured(true);
        setShowInput(false);
        setApiKey('');
      } else {
        alert('Invalid API key. Please check and try again.');
      }
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('gemini_api_key');
    setIsConfigured(false);
    setShowInput(false);
  };

  if (!showInput && isConfigured) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <Brain className="w-4 h-4 text-green-500" />
        <span className="text-green-600">AI Enhanced</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowInput(true)}
          className="text-xs"
        >
          Configure
        </Button>
      </div>
    );
  }

  if (!showInput && !isConfigured) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowInput(true)}
        className="border-blue-500 text-blue-500 hover:bg-blue-50"
      >
        <Brain className="w-4 h-4 mr-2" />
        Enable AI Analysis
      </Button>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="w-5 h-5 mr-2 text-blue-500" />
          AI Enhancement Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            To enable advanced AI scam detection, please enter your Google Gemini API key. 
            This will be stored locally and used to analyze content for scam patterns.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Enter your Gemini API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="font-mono text-sm"
          />
          <div className="text-xs text-gray-500">
            Get your free API key at: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleSaveKey} disabled={!apiKey.trim()} className="flex-1">
            <Key className="w-4 h-4 mr-2" />
            Save & Enable AI
          </Button>
          <Button variant="outline" onClick={() => setShowInput(false)}>
            Cancel
          </Button>
        </div>

        {isConfigured && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRemoveKey}
            className="w-full"
          >
            Remove AI Key
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AIKeyInput;
