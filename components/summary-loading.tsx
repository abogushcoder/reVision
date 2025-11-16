
import { StyleSheet, Text, View } from "react-native"
import AppText from "./app-text";


export default function SummaryLoading({
}) {

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 8,
      paddingVertical: 20
    },
    text: {
      fontSize: 20,
    }
  });

  return (
    <View style={styles.container}>
      <AppText style={styles.text}>Recalling what you last read...</AppText>
    </View>

  );


}
