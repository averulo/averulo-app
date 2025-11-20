// utils/locationService.js
import * as Location from 'expo-location';
import Constants from 'expo-constants';

const MAPBOX_TOKEN = Constants.expoConfig?.extra?.mapboxAccessToken;

/**
 * Get user's current location
 */
export async function getCurrentLocation() {
  try {
    // Request permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
}

/**
 * Search for places using Mapbox Geocoding API
 * @param {string} query - Search query
 * @param {object} proximity - Optional {latitude, longitude} for proximity bias
 */
export async function searchPlaces(query, proximity = null) {
  try {
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'YOUR_MAPBOX_TOKEN_HERE') {
      console.warn('Mapbox token not configured');
      return [];
    }

    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=NG&types=place,locality,neighborhood,address&limit=5`;

    // Add proximity bias if available
    if (proximity) {
      url += `&proximity=${proximity.longitude},${proximity.latitude}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    return data.features.map(feature => ({
      id: feature.id,
      name: feature.place_name,
      shortName: feature.text,
      coordinates: {
        latitude: feature.center[1],
        longitude: feature.center[0],
      },
      placeName: feature.place_name,
    }));
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @returns distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km}km`;
}
