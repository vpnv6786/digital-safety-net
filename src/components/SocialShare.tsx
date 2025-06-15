
import React, { useState } from 'react';
import { Facebook, Twitter, Share, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  className?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({
  url = window.location.href,
  title = document.title,
  description = '',
  hashtags = [],
  className = ''
}) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${hashtags.join(',')}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(language === 'en' ? 'Link copied to clipboard!' : 'Đã sao chép liên kết!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to copy link' : 'Không thể sao chép liên kết');
    }
  };

  const handleShare = (platform: 'facebook' | 'twitter') => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        console.log('Native share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-gray-600 mr-2">
        {language === 'en' ? 'Share:' : 'Chia sẻ:'}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('facebook')}
        className="flex items-center space-x-1"
      >
        <Facebook className="w-4 h-4" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="flex items-center space-x-1"
      >
        <Twitter className="w-4 h-4" />
        <span className="hidden sm:inline">Twitter</span>
      </Button>
      
      {navigator.share ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="flex items-center space-x-1"
        >
          <Share className="w-4 h-4" />
          <span className="hidden sm:inline">
            {language === 'en' ? 'Share' : 'Chia sẻ'}
          </span>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="flex items-center space-x-1"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span className="hidden sm:inline">
            {copied 
              ? (language === 'en' ? 'Copied!' : 'Đã sao chép!')
              : (language === 'en' ? 'Copy Link' : 'Sao chép')
            }
          </span>
        </Button>
      )}
    </div>
  );
};

export default SocialShare;
