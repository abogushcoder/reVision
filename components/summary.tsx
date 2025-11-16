import {  StyleSheet, Text, View } from "react-native"
import AppText from "./app-text";

export type SummaryProps = {
  summary: string
}

export default function Summary({
  summary
}: SummaryProps) {

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 8
    },
    text: {
      fontSize: 20,
    }
  });

  return (
    <View style={styles.container}>
      <AppText style={styles.text}>{summary}</AppText>
    </View>

  );


}
