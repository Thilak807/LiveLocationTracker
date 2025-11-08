# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a


You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:


## Join the community

Join our community of developers creating universal apps.


## LiveLocationApp — Google-maps-like features

This project demonstrates a live location map using Expo, `react-native-maps`, and Google Maps Platform APIs (Places, Directions, Roads).

Important: The app includes client-side calls to Google APIs (Places Autocomplete, Place Details, Directions, Roads). You MUST provide your Google API key and enable billing and the corresponding APIs in Google Cloud Console.

## Setup (add your API key)

1. Add your API key into `app.json` under `expo.extra.googleMapsApiKey`:

```json
{
   "expo": {
      "extra": {
         "googleMapsApiKey": "YOUR_GOOGLE_API_KEY"
      }
   }
}
```

Alternatively, set an environment variable before starting the dev server:

PowerShell:

```powershell
$env:GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_API_KEY"
npm start
```

Linux/macOS:

```bash
export GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_API_KEY"
npm start
```

2. Restrict the API key for production in Google Cloud Console (Android package + SHA1 and iOS bundle id).

3. Enable the following APIs in Google Cloud:
- Places API
- Directions API
- Roads API (optional, used for snap-to-road)

## How it works

- Search box uses Places Autocomplete (debounced + small cache) to show suggestions.
- Selecting a suggestion fetches Place Details and recenters the map.
- FAB starts Directions from current location to the selected place and draws a polyline.
- The app periodically attempts to `snapToRoads` for better visual accuracy (if the Roads API is enabled).

## Notes

- For production, proxy Google API calls via your backend or ensure API key restrictions are set.
- Autocomplete caching is a simple in-memory cache with a 5-minute TTL.
- Directions and Roads API calls are billable.

## Troubleshooting

If autocomplete or directions don't return results, confirm your key is present and the APIs are enabled. Check Metro logs for network errors.
