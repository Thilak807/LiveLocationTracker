import { ThemedView } from '@/components/themed-view';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

type MapType = 'standard' | 'satellite' | 'hybrid';

export default function ExploreScreen() {
  const router = useRouter();

  // --- State ---
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [isRequesting, setIsRequesting] = useState<boolean>(true);

  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [follow, setFollow] = useState<boolean>(true);
  const [mapType, setMapType] = useState<MapType>('standard');
  const [showsTraffic, setShowsTraffic] = useState<boolean>(false);
  const [showLayers, setShowLayers] = useState<boolean>(false);

  // --- Refs ---
  const mapRef = useRef<MapView | null>(null);
  const subRef = useRef<Location.LocationSubscription | null>(null);

  // --- Ask permission (OS popup) ---
  const requestPermission = useCallback(async () => {
    try {
      setIsRequesting(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status === 'granted') {
        // Initial fix
        const initial = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(initial.coords);
        const initRegion: Region = {
          latitude: initial.coords.latitude,
          longitude: initial.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(initRegion);

        // Start watching
        subRef.current?.remove();
        subRef.current = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 3, timeInterval: 1500 },
          (loc) => {
            setLocation(loc.coords);
            if (follow) {
              const r: Region = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta,
              };
              setRegion(r);
              mapRef.current?.animateToRegion(r, 400);
            }
          }
        );
      }
    } finally {
      setIsRequesting(false);
    }
  }, [follow, region.latitudeDelta, region.longitudeDelta]);

  // Ask on screen load (matches assignment)
  useEffect(() => {
    requestPermission();
    return () => subRef.current?.remove();
  }, [requestPermission]);

  // --- UI handlers ---
  const handleZoom = (factor: number) => {
    const lat = Math.min(Math.max(region.latitudeDelta * factor, 0.0005), 80);
    const lng = Math.min(Math.max(region.longitudeDelta * factor, 0.0005), 80);
    const r: Region = { ...region, latitudeDelta: lat, longitudeDelta: lng };
    setRegion(r);
    mapRef.current?.animateToRegion(r, 250);
    setFollow(false);
  };

  const handleRecenter = () => {
    if (!location) return;
    const r: Region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    };
    setRegion(r);
    mapRef.current?.animateToRegion(r, 350);
    setFollow(true);
  };

  const toggleLayers = () => setShowLayers((v) => !v);
  const changeMapType = (t: MapType) => {
    setMapType(t);
    setShowLayers(false);
  };
  const toggleTraffic = () => {
    setShowsTraffic((s) => !s);
    setShowLayers(false);
  };

  // --- Loading while asking permission ---
  if (permissionStatus === null || isRequesting) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Requesting location permission…</Text>
      </ThemedView>
    );
  }

  // --- Denied path (your B text + Try Again + Open Settings on Android) ---
  if (permissionStatus !== 'granted') {
    return (
      <ThemedView style={styles.center}>
        <Text style={styles.deniedTitle}>Location permission denied.</Text>
        <Text style={styles.deniedSub}>Please allow access to continue.</Text>

        <Pressable
          onPress={requestPermission}
          style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
        >
          <Text style={styles.primaryText}>Try Again</Text>
        </Pressable>

        {Platform.OS === 'android' && (
          <Pressable
            onPress={() => Linking.openSettings()}
            style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
          >
            <Text style={styles.secondaryText}>Open Phone Settings</Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => router.push('/')}
          style={({ pressed }) => [styles.ghost, pressed && styles.pressed]}
        >
          <Text style={styles.ghostText}>Back to Home</Text>
        </Pressable>
      </ThemedView>
    );
  }

  // --- We have permission, but waiting initial fix ---
  if (!location) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Getting your location…</Text>
      </ThemedView>
    );
  }

  // --- Main Map ---
  return (
    <View style={styles.container}>
      {/* Back button */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.push('/')}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Text style={styles.backTxt}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Live Tracking</Text>
        <View style={{ width: 64 }} />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        mapType={mapType}
        showsTraffic={showsTraffic}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass
        rotateEnabled
        pitchEnabled={false}
      >
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          tracksViewChanges={false}
        />
      </MapView>

      {/* Controls (top-right) */}
      <View style={styles.topRight} pointerEvents="box-none">
        {/* Follow / Recenter */}
        <Pressable
          onPress={() => setFollow((f) => !f)}
          style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
        >
          <Text style={styles.chipText}>{follow ? '📍 Following' : '📍 Follow'}</Text>
        </Pressable>

        {!follow && (
          <Pressable
            onPress={handleRecenter}
            style={({ pressed }) => [styles.chip, styles.accent, pressed && styles.pressed]}
          >
            <Text style={styles.chipText}>🎯 Center</Text>
          </Pressable>
        )}

        {/* Layers */}
        <Pressable
          onPress={toggleLayers}
          style={({ pressed }) => [styles.chip, styles.info, pressed && styles.pressed]}
        >
          <Text style={styles.chipText}>🌍 Layers</Text>
        </Pressable>

        {showLayers && (
          <View style={styles.layerCard}>
            <Pressable
              onPress={() => changeMapType('standard')}
              style={({ pressed }) => [
                styles.layerBtn,
                mapType === 'standard' && styles.layerActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.layerText}>🗺️ Standard</Text>
            </Pressable>
            <Pressable
              onPress={() => changeMapType('satellite')}
              style={({ pressed }) => [
                styles.layerBtn,
                mapType === 'satellite' && styles.layerActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.layerText}>🛰️ Satellite</Text>
            </Pressable>
            <Pressable
              onPress={() => changeMapType('hybrid')}
              style={({ pressed }) => [
                styles.layerBtn,
                mapType === 'hybrid' && styles.layerActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.layerText}>🌆 Hybrid</Text>
            </Pressable>
            <Pressable
              onPress={toggleTraffic}
              style={({ pressed }) => [
                styles.layerBtn,
                showsTraffic && styles.layerActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.layerText}>
                {showsTraffic ? '🚦 Traffic On' : '🚦 Traffic Off'}
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Zoom controls */}
      <View style={styles.zoomBox} pointerEvents="box-none">
        <Pressable
          onPress={() => handleZoom(0.5)}
          style={({ pressed }) => [styles.zoomBtn, pressed && styles.pressed]}
        >
          <Text style={styles.zoomTxt}>＋</Text>
        </Pressable>
        <Pressable
          onPress={() => handleZoom(2)}
          style={({ pressed }) => [styles.zoomBtn, pressed && styles.pressed]}
        >
          <Text style={styles.zoomTxt}>－</Text>
        </Pressable>
      </View>

      {/* Info panel */}
      <View style={styles.infoBox} pointerEvents="box-none">
        <View style={styles.infoPanel}>
          <Text style={styles.infoTxt}>Lat: {location.latitude.toFixed(6)}</Text>
          <Text style={styles.infoTxt}>Lon: {location.longitude.toFixed(6)}</Text>
          {typeof location.accuracy === 'number' && (
            <Text style={styles.infoTxt}>Accuracy: ±{Math.round(location.accuracy)}m</Text>
          )}
          <Text style={styles.infoTxt}>
            Map: {mapType}
            {showsTraffic ? ' + Traffic' : ''}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // layout
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },

  // header
  header: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    zIndex: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  backTxt: { color: '#fff', fontWeight: '700' },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // texts
  loadingText: { marginTop: 10, fontSize: 16, fontWeight: '600' },
  deniedTitle: { fontSize: 20, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  deniedSub: { fontSize: 14, opacity: 0.7, marginBottom: 16, textAlign: 'center' },

  // buttons
  primary: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginTop: 4,
    minWidth: 200,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '600' },
  secondary: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderColor: '#007AFF',
    borderWidth: 1,
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryText: { color: '#007AFF', fontWeight: '600' },
  ghost: { marginTop: 10, padding: 10, minWidth: 200, alignItems: 'center' },
  ghostText: { color: '#666', fontWeight: '600' },
  pressed: { opacity: 0.85 },

  // controls
  topRight: { position: 'absolute', top: 70, right: 14, zIndex: 20, alignItems: 'flex-end' },
  chip: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 3,
  },
  chipText: { color: '#fff', fontWeight: '600' },
  accent: { backgroundColor: 'rgba(255,122,0,0.85)' },
  info: { backgroundColor: 'rgba(0,122,255,0.85)' },

  layerCard: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 10,
    padding: 8,
    marginTop: 8,
    width: 180,
    elevation: 6,
  },
  layerBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 4 },
  layerActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  layerText: { color: '#fff', fontWeight: '500' },

  // zoom
  zoomBox: { position: 'absolute', right: 16, top: '45%', zIndex: 20, alignItems: 'center' },
  zoomBtn: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  zoomTxt: { color: '#fff', fontSize: 22, fontWeight: '800' },

  // info
  infoBox: { position: 'absolute', left: 16, right: 16, bottom: 18, zIndex: 20 },
  infoPanel: { backgroundColor: 'rgba(0,0,0,0.75)', padding: 10, borderRadius: 10 },
  infoTxt: { color: '#fff', fontSize: 12, marginBottom: 2 },
});
