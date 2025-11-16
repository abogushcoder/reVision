import { Pressable, StyleSheet, Text, View } from "react-native"
import Slider from '@react-native-community/slider';
import AppText from "./app-text";
import CustomSlider from "./custom-slider";

export type OptionsMenuProps = {
  goBack: any,
  currentPageNum: number,
  setCurrentPageNum: any,
  totalPages: number,
}

export default function OptionsMenu({
  goBack,
  currentPageNum,
  setCurrentPageNum,
  totalPages
}: OptionsMenuProps) {

  const styles = StyleSheet.create({
    container: {
      justifyContent: "space-evenly"
    },
    topChunk: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 20,
      paddingHorizontal: 12
    },
    backButton: {
      width: 48,
      height: 48,
      justifyContent: "center",
      alignItems: "center",
    },
    backButtonText: {
      fontSize: 48,
    },
    middleChunk: {
      height: 120,
      width: 300,
      alignItems: "center",
      justifyContent: "center"
    },
    pageNumberingText: {
      fontSize: 24
    },
    sliderContainer: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center"
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.topChunk}>
        <Pressable style={styles.backButton} onPress={goBack}>
          <AppText style={styles.backButtonText}>{'<-'}</AppText>
        </Pressable>
        <AppText style={styles.pageNumberingText}>{`Page ${currentPageNum} of ${totalPages}`}</AppText>
      </View>
      <View style={styles.middleChunk}>
        <View style={styles.sliderContainer}>
          <Slider
            style={{ width: 300, height: 40 }}
            minimumValue={1}
            maximumValue={totalPages}
            step={1}
            value={currentPageNum}
            onValueChange={setCurrentPageNum}
            minimumTrackTintColor="#4a90e2"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#4a90e2"
          />
        </View>
      </View>

    </View>
  );


}
