import { StyleSheet, Text, View } from "react-native"
import AppText from "./app-text";
// import { ReaderProvider } from "@epubjs-react-native/core";
// import EpubReaderScreen from "./src/EpubReaderScreen";

export type ReadingAreaProps = {
  pageText?: string;
  fontSize: number,
  lineHeight: number
}

export default function ReadingArea({
  pageText,
  fontSize,
  lineHeight
}: ReadingAreaProps) {

  const styles = StyleSheet.create({
    container: {
      padding: 12,
      flex: 1,
      backgroundColor: '#eee',
    },
    content: {
      textAlign: 'left',
      fontSize: fontSize,
      lineHeight: lineHeight * fontSize,
    },
  });



  return (
    <View style={styles.container}>
      <AppText style={styles.content}>
        {pageText}

      </AppText>

    </View>
  );


}
