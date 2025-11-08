import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>Live Location Tracker</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>Track your GPS location in real time</ThemedText>

        <Link href="/explore" style={styles.startButton}>
          <ThemedText style={styles.startButtonText}>Start</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, opacity: 0.7, marginBottom: 32, textAlign: 'center' },
  startButton: { backgroundColor: '#007AFF', paddingVertical: 14, paddingHorizontal: 26, borderRadius: 12, elevation: 3 },
  startButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
