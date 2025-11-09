# LiveLocationTracker 📍

A real-time location tracking app built with Expo and React Native, featuring live location tracking, search, directions, and more.

## Features 🚀

- 📍 Real-time GPS location tracking
- 🗺️ Multiple map types (Standard, Satellite, Hybrid)
- 🔍 Places search functionality
- 🛣️ Turn-by-turn directions
- 📱 Beautiful UI with bottom sheets and animations
- 🎯 High-accuracy location tracking
- 📊 Real-time location stats (accuracy, heading, speed)
- 🔄 Follow mode & manual map controls

[📱 Watch Demo Video](https://drive.google.com/file/d/1X51m923z8rAp7lfwo8p-pEn9O9x2XMbR/view?usp=sharing)


## Screenshots 📸

### Home Screen
<img src="./assets/images/Live Location Tracker 1.jpeg" width="300" />

### Live Tracking Screen
<img src="./assets/images/Live Location Tracker2.jpeg" width="300" />


## Tech Stack 💻

- [Expo](https://expo.dev/) - React Native development platform
- [React Native](https://reactnative.dev/) - Cross-platform mobile framework
- [react-native-maps](https://github.com/react-native-maps/react-native-maps) - Maps component
- [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) - Location services
- [@expo/vector-icons](https://docs.expo.dev/guides/icons/) - Icon pack
- [expo-router](https://expo.github.io/router/docs/) - File-based routing
- [@mapbox/polyline](https://github.com/mapbox/polyline) - Polyline encoding/decoding

## Setup & Installation 🛠️

### Prerequisites

1. Node.js & npm installed
2. Expo CLI: `npm install -g expo-cli`
3. Expo account (for deployment)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Thilak807/LiveLocationTracker
   cd LiveLocationTracker
   ```

2. Install required packages:
   ```bash
   npx expo install expo-location react-native-maps
   npm install
   ```

### Running the App 🚀

1. Start the development server:
   ```bash
   npx expo start
   ```

2. Run on a device:
   - Scan QR code with Expo Go app (iOS/Android)
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator

### Building for Production 🏗️

1. Configure EAS Build:
   ```bash
   eas build:configure
   ```

2. Build for your platform:
   ```bash
   # For Android
   eas build --platform android
   # For iOS
   eas build --platform ios
   ```

## Development

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Development Guide 🔧

The app is structured using Expo Router's file-based routing system. Key files and directories:

- `app/(tabs)/index.tsx` - Main map screen with location tracking
- `app/(tabs)/explore.tsx` - Places search and directions
- `app/_layout.tsx` - Root layout with theme setup
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks
- `constants/` - Theme and configuration

### App Features ⚙️

The app includes several key features:

1. Real-time location tracking
2. Interactive map controls
3. Place search functionality
4. Turn-by-turn directions
5. Beautiful user interface with smooth animations

The app is designed to work seamlessly on both iOS and Android platforms.

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact 📧

Thilak Raj P  
GitHub: https://github.com/Thilak807
Project Link: [https://github.com/Thilak807/LiveLocationTracker](https://github.com/Thilak807/LiveLocationTracker)

## Acknowledgements 🙏

- [Expo](https://expo.dev)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Google Maps Platform](https://cloud.google.com/maps-platform)
- [Expo Router](https://expo.github.io/router/docs)
- Selecting a suggestion fetches Place Details and recenters the map.
- FAB starts Directions from current location to the selected place and draws a polyline.
- The app periodically attempts to `snapToRoads` for better visual accuracy (if the Roads API is enabled).

## Commands Quick Reference 🔧

Start the development server:
```bash
npx expo start
```

Available Commands:
- `s` - Switch to development build
- `a` - Open Android
- `w` - Open web
- `j` - Open debugger
- `r` - Reload app
- `m` - Toggle menu
- `shift+m` - More tools
- `o` - Open project code in editor
- `?` - Show all commands
