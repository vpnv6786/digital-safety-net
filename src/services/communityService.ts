
import { supabase } from '@/integrations/supabase/client';

export interface CommunityAlert {
  id?: string;
  title: string;
  description: string;
  alert_type: 'scam_warning' | 'danger_zone' | 'safety_tip' | 'urgent_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location_name?: string;
  latitude?: number;
  longitude?: number;
  affected_areas?: string[];
  source_type?: 'user_report' | 'authority' | 'community' | 'auto_detected';
  tags?: string[];
  contact_info?: string;
  evidence_urls?: string[];
  is_verified?: boolean;
  reporter_user_id?: string;
  verified_by?: string;
  expires_at?: string;
  view_count?: number;
  upvotes?: number;
  downvotes?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ScamStatistic {
  id: string;
  scam_type: string;
  title: string;
  description: string;
  danger_level: 'low' | 'medium' | 'high' | 'critical';
  frequency_score: number;
  damage_score: number;
  total_reports: number;
  recent_trend: 'increasing' | 'stable' | 'decreasing';
  prevention_tips: string[];
  warning_signs: string[];
}

class CommunityService {
  // Get all scam statistics
  async getScamStatistics(): Promise<ScamStatistic[]> {
    try {
      const { data, error } = await supabase
        .from('scam_statistics')
        .select('*')
        .order('frequency_score', { ascending: false });

      if (error) {
        console.error('Error fetching scam statistics:', error);
        return [];
      }

      return data as ScamStatistic[] || [];
    } catch (error) {
      console.error('Error fetching scam statistics:', error);
      return [];
    }
  }

  // Get community alerts
  async getCommunityAlerts(limit: number = 50): Promise<CommunityAlert[]> {
    try {
      const { data, error } = await supabase
        .from('community_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching community alerts:', error);
        return [];
      }

      return data as CommunityAlert[] || [];
    } catch (error) {
      console.error('Error fetching community alerts:', error);
      return [];
    }
  }

  // Create a new community alert
  async createCommunityAlert(alert: CommunityAlert): Promise<boolean> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        console.error('User not authenticated');
        return false;
      }

      const { error } = await supabase
        .from('community_alerts')
        .insert({
          ...alert,
          reporter_user_id: user.id,
          source_type: alert.source_type || 'user_report'
        });

      if (error) {
        console.error('Error creating community alert:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error creating community alert:', error);
      return false;
    }
  }

  // Upvote an alert
  async upvoteAlert(alertId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('increment_alert_upvotes', {
        alert_id: alertId
      });

      if (error) {
        console.error('Error upvoting alert:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error upvoting alert:', error);
      return false;
    }
  }

  // Downvote an alert
  async downvoteAlert(alertId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('increment_alert_downvotes', {
        alert_id: alertId
      });

      if (error) {
        console.error('Error downvoting alert:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error downvoting alert:', error);
      return false;
    }
  }

  // Get trending scam types
  async getTrendingScams(): Promise<ScamStatistic[]> {
    try {
      const { data, error } = await supabase
        .from('scam_statistics')
        .select('*')
        .eq('recent_trend', 'increasing')
        .order('frequency_score', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching trending scams:', error);
        return [];
      }

      return data as ScamStatistic[] || [];
    } catch (error) {
      console.error('Error fetching trending scams:', error);
      return [];
    }
  }

  // Subscribe to real-time alerts
  subscribeToAlerts(callback: (alert: CommunityAlert) => void) {
    const channel = supabase
      .channel('community_alerts_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_alerts'
        },
        (payload) => {
          callback(payload.new as CommunityAlert);
        }
      )
      .subscribe();

    return channel;
  }
}

export const communityService = new CommunityService();
