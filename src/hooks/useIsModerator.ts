import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { isModerator } from '@/services/moderationService';

/** null while unknown. The database enforces the role; this only decides what to show. */
export function useIsModerator(): boolean | null {
  const { user, loading } = useAuth();
  const [moderator, setModerator] = useState<boolean | null>(null);
  useEffect(() => {
    if (loading) return;
    if (!user) {
      setModerator(false);
      return;
    }
    let live = true;
    isModerator(user.id).then((m) => live && setModerator(m)).catch(() => live && setModerator(false));
    return () => {
      live = false;
    };
  }, [user, loading]);
  return moderator;
}
