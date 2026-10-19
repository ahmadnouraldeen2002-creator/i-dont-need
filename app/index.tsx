import { StyleSheet, Text, View } from 'react-native';

// Temporary placeholder screen for M0. Replaced by the real shell and i18n strings in M1.
export default function PlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>APP_NAME</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
  },
});
