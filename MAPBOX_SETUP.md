# Mapbox Location Search Setup Guide

## ✅ What's Been Completed

### 1. Packages Installed
- ✅ `@rnmapbox/maps` - Mapbox SDK
- ✅ `expo-location` - Location services

### 2. Configuration
- ✅ Added location permissions to iOS (NSLocationWhenInUseUsageDescription)
- ✅ Added location permissions to Android (ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION)
- ✅ Added Mapbox token placeholder in [app.json](app.json#L56)

### 3. New Files Created
- ✅ [utils/locationService.js](utils/locationService.js) - Location utilities
  - `getCurrentLocation()` - Get user's GPS location
  - `searchPlaces(query, proximity)` - Mapbox Places autocomplete
  - `calculateDistance(lat1, lon1, lat2, lon2)` - Distance calculation
  - `formatDistance(km)` - Format distance for display

### 4. Updated Files

#### [screens/searchScreen.js](screens/searchScreen.js)
- ✅ Added "Use My Location" button
- ✅ Mapbox Places API autocomplete
- ✅ Location-based search
- ✅ Navigate with coordinates to PropertiesListScreen

#### [screens/PropertiesListScreen.js](screens/PropertiesListScreen.js)
- ✅ Accept latitude, longitude, radius params
- ✅ Calculate distance for each property
- ✅ Filter properties by radius
- ✅ Sort by distance (closest first)
- ✅ Display distance on property cards
- ✅ Show location badge when searching by location

## 🚀 Setup Instructions

### Step 1: Get Mapbox API Token

1. Go to https://account.mapbox.com/
2. Sign up for free account
3. Copy your **Public Access Token**
4. Open [app.json](app.json:56)
5. Replace `"YOUR_MAPBOX_TOKEN_HERE"` with your actual token:

```json
"mapboxAccessToken": "pk.eyJ1IjoieW91cnVzZXJuYW1lIiwi..."
```

### Step 2: Test the Feature

1. **Open Search Screen:**
   - Tap search in your app
   - You'll see "Use my current location" button

2. **Test Location Search:**
   - Tap "Use my current location"
   - App will request location permission
   - Properties will load sorted by distance

3. **Test Place Autocomplete:**
   - Type a city name (e.g., "Victoria Island")
   - Mapbox will show location suggestions
   - Tap a suggestion to see nearby properties

## 📱 Features

### Search Screen
- **Use My Location** - Get properties within 10km radius
- **Mapbox Autocomplete** - Search any location in Nigeria
- **Real-time suggestions** - As you type

### Properties List
- **Distance Display** - Shows "2.3km away" for each property
- **Location Badge** - "Properties near Victoria Island"
- **Sorted by Distance** - Closest properties first
- **Radius Filtering** - Only shows properties within radius

## 🔧 Backend Integration (Optional)

To optimize performance, you can add a backend endpoint for geolocation search:

```javascript
// averulo-backend/routes/properties.js

router.get('/', async (req, res) => {
  const { lat, lon, radius, q } = req.query;

  let where = { status: 'ACTIVE' };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { city: { contains: q, mode: 'insensitive' } },
    ];
  }

  const properties = await prisma.property.findMany({ where });

  // If location params, filter by distance
  if (lat && lon && radius) {
    const filtered = properties.filter(p => {
      if (!p.latitude || !p.longitude) return false;
      const dist = calculateDistance(lat, lon, p.latitude, p.longitude);
      return dist <= parseFloat(radius);
    });
    return res.json({ items: filtered });
  }

  res.json({ items: properties });
});
```

## 🎯 Next Steps

1. **Add Properties with Coordinates** - Make sure your properties have `latitude` and `longitude` fields
2. **Test on Real Device** - Location works better on physical devices
3. **Add Distance Filter UI** - Add radius selector (5km, 10km, 20km)
4. **Add Map View** - Show properties on a map (optional)

## 💡 Tips

- **Free Tier Limits:** 50,000 requests/month
- **Nigeria Coverage:** Mapbox has good coverage in major Nigerian cities
- **Fallback:** If Mapbox token not configured, app still works with text search
- **Permissions:** Users must grant location permission for "Use My Location" to work

## 🐛 Troubleshooting

**"Location permission denied"**
- User needs to grant location permission in device settings

**"No results found"**
- Check that properties in database have `latitude` and `longitude` fields
- Make sure Mapbox token is correctly added to app.json

**"Mapbox token not configured" warning**
- Replace placeholder token in app.json with your actual Mapbox token

## 📚 Resources

- [Mapbox Documentation](https://docs.mapbox.com/)
- [Expo Location Docs](https://docs.expo.dev/versions/latest/sdk/location/)
- [Mapbox Pricing](https://www.mapbox.com/pricing/)
