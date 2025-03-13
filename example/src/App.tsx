import { View, StyleSheet } from 'react-native';
import { WiniMobileView } from 'react-native-wini-mobile';

export default function App() {
  return (
    <View style={styles.container}>
      <WiniMobileView color="#32a852" style={styles.box} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
