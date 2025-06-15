
import { supabase } from '@/integrations/supabase/client';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: string;
  isEmergency?: boolean;
  batteryLevel?: number;
}

export interface DangerZone {
  id: string;
  name: string;
  description: string;
  center_latitude: number;
  center_longitude: number;
  radius_meters: number;
  danger_level: 'low' | 'medium' | 'high' | 'critical';
  active_from?: string;
  active_to?: string;
  days_of_week: number[];
}

export interface EmergencyContact {
  id: string;
  contact_name: string;
  contact_phone?: string;
  contact_email?: string;
  relationship?: string;
  is_primary: boolean;
}

class LocationService {
  private watchId: number | null = null;
  private lastLocation: LocationData | null = null;
  private dangerZones: DangerZone[] = [];

  // Request location permission and start tracking
  async startTracking(): Promise<boolean> {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      return false;
    }

    try {
      // Request permission
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'denied') {
        throw new Error('Location permission denied');
      }

      // Load danger zones
      await this.loadDangerZones();

      // Start watching position
      this.watchId = navigator.geolocation.watchPosition(
        (position) => this.handleLocationUpdate(position),
        (error) => this.handleLocationError(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );

      console.log('Location tracking started');
      return true;
    } catch (error) {
      console.error('Failed to start location tracking:', error);
      return false;
    }
  }

  // Stop location tracking
  stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      console.log('Location tracking stopped');
    }
  }

  // Handle location updates
  private async handleLocationUpdate(position: GeolocationPosition): Promise<void> {
    const locationData: LocationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date().toISOString(),
      batteryLevel: await this.getBatteryLevel()
    };

    this.lastLocation = locationData;

    // Save to database
    await this.saveLocation(locationData);

    // Check for danger zones
    await this.checkDangerZones(locationData);
  }

  // Handle location errors
  private handleLocationError(error: GeolocationPositionError): void {
    console.error('Location error:', error);
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        console.error('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        console.error('The request to get user location timed out.');
        break;
    }
  }

  // Save location to database
  private async saveLocation(locationData: LocationData): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { error } = await supabase
        .from('user_locations')
        .insert({
          user_id: user.id,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          accuracy: locationData.accuracy,
          is_emergency: locationData.isEmergency || false,
          battery_level: locationData.batteryLevel,
          timestamp: locationData.timestamp || new Date().toISOString()
        });

      if (error) {
        console.error('Failed to save location:', error);
      }
    } catch (error) {
      console.error('Error saving location:', error);
    }
  }

  // Load danger zones from database
  private async loadDangerZones(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('danger_zones')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Failed to load danger zones:', error);
        return;
      }

      // Type cast the danger_level to the expected union type
      this.dangerZones = (data || []).map(zone => ({
        ...zone,
        danger_level: zone.danger_level as 'low' | 'medium' | 'high' | 'critical'
      }));
      
      console.log(`Loaded ${this.dangerZones.length} danger zones`);
    } catch (error) {
      console.error('Error loading danger zones:', error);
    }
  }

  // Check if current location is in any danger zone
  private async checkDangerZones(location: LocationData): Promise<void> {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentDay = currentTime.getDay();

    for (const zone of this.dangerZones) {
      // Check if zone is active for current day
      if (!zone.days_of_week.includes(currentDay)) continue;

      // Check if zone is active for current time
      if (zone.active_from && zone.active_to) {
        const [fromHour, fromMinute] = zone.active_from.split(':').map(Number);
        const [toHour, toMinute] = zone.active_to.split(':').map(Number);
        
        const currentTimeMinutes = currentHour * 60 + currentMinute;
        const fromTimeMinutes = fromHour * 60 + fromMinute;
        const toTimeMinutes = toHour * 60 + toMinute;

        // Handle overnight periods (e.g., 22:00 to 05:00)
        const isInTimeRange = fromTimeMinutes > toTimeMinutes
          ? (currentTimeMinutes >= fromTimeMinutes || currentTimeMinutes <= toTimeMinutes)
          : (currentTimeMinutes >= fromTimeMinutes && currentTimeMinutes <= toTimeMinutes);

        if (!isInTimeRange) continue;
      }

      // Calculate distance to danger zone
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        zone.center_latitude,
        zone.center_longitude
      );

      // Check if within danger zone radius
      if (distance <= zone.radius_meters) {
        await this.triggerDangerZoneAlert(zone, location);
      }
    }
  }

  // Calculate distance between two points (Haversine formula)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Trigger danger zone alert
  private async triggerDangerZoneAlert(zone: DangerZone, location: LocationData): Promise<void> {
    try {
      console.log(`DANGER ZONE ALERT: Entered ${zone.name}`);
      
      // Create alert record
      await this.createAlert('danger_zone', {
        message: `Bạn đã vào khu vực nguy hiểm: ${zone.name}. ${zone.description}`,
        dangerZoneId: zone.id,
        location
      });

      // Send notifications
      await this.sendEmergencyNotifications('danger_zone', {
        zoneName: zone.name,
        dangerLevel: zone.danger_level,
        location
      });

    } catch (error) {
      console.error('Failed to trigger danger zone alert:', error);
    }
  }

  // Send emergency alert manually
  async sendEmergencyAlert(): Promise<boolean> {
    try {
      if (!this.lastLocation) {
        // Try to get current location immediately
        const position = await this.getCurrentPosition();
        this.lastLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
          isEmergency: true
        };
      }

      // Save emergency location
      await this.saveLocation({ ...this.lastLocation, isEmergency: true });

      // Create alert record
      await this.createAlert('emergency_button', {
        message: 'Cảnh báo khẩn cấp được kích hoạt!',
        location: this.lastLocation
      });

      // Send notifications
      await this.sendEmergencyNotifications('emergency_button', {
        location: this.lastLocation
      });

      console.log('Emergency alert sent successfully');
      return true;
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
      return false;
    }
  }

  // Get current position (one-time)
  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      });
    });
  }

  // Create alert record in database
  private async createAlert(alertType: string, data: any): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { error } = await supabase
        .from('alert_history')
        .insert({
          user_id: user.id,
          alert_type: alertType,
          message: data.message,
          danger_zone_id: data.dangerZoneId,
          location_id: data.location ? await this.getLocationId(data.location) : null
        });

      if (error) {
        console.error('Failed to create alert record:', error);
      }
    } catch (error) {
      console.error('Error creating alert record:', error);
    }
  }

  // Get location ID after saving
  private async getLocationId(location: LocationData): Promise<string | null> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_locations')
        .select('id')
        .eq('user_id', user.id)
        .eq('latitude', location.latitude)
        .eq('longitude', location.longitude)
        .eq('timestamp', location.timestamp)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Failed to get location ID:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error getting location ID:', error);
      return null;
    }
  }

  // Send emergency notifications via edge function
  private async sendEmergencyNotifications(alertType: string, data: any): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-emergency-alert', {
        body: {
          alertType,
          data,
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Failed to send emergency notifications:', error);
      }
    } catch (error) {
      console.error('Error sending emergency notifications:', error);
    }
  }

  // Get battery level
  private async getBatteryLevel(): Promise<number | undefined> {
    try {
      // @ts-ignore - Battery API might not be available in all browsers
      if ('getBattery' in navigator) {
        // @ts-ignore
        const battery = await navigator.getBattery();
        return Math.round(battery.level * 100);
      }
    } catch (error) {
      console.log('Battery API not available');
    }
    return undefined;
  }

  // Get emergency contacts
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return [];

      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false });

      if (error) {
        console.error('Failed to get emergency contacts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting emergency contacts:', error);
      return [];
    }
  }

  // Add emergency contact
  async addEmergencyContact(contact: Omit<EmergencyContact, 'id'>): Promise<boolean> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return false;

      const { error } = await supabase
        .from('emergency_contacts')
        .insert({
          user_id: user.id,
          contact_name: contact.contact_name,
          contact_phone: contact.contact_phone,
          contact_email: contact.contact_email,
          relationship: contact.relationship,
          is_primary: contact.is_primary
        });

      if (error) {
        console.error('Failed to add emergency contact:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      return false;
    }
  }
}

export const locationService = new LocationService();
