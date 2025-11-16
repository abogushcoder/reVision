import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  PanResponder,
  PanResponderInstance,
  LayoutChangeEvent,
  StyleSheet,
} from "react-native";

type CustomSliderProps = {
  value: number;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  onSlidingStart?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  disabled?: boolean;

  trackHeight?: number;
  thumbSize?: number;
  renderThumb?: () => React.ReactNode;
  renderTrack?: (opts: { progress: number }) => React.ReactNode;
  style?: any;
};

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

function roundToStep(value: number, step: number) {
  return Math.round(value / step) * step;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  minimumValue = 0,
  maximumValue = 1,
  step,
  onValueChange,
  onSlidingStart,
  onSlidingComplete,
  disabled = false,
  trackHeight = 4,
  thumbSize = 24,
  renderThumb,
  renderTrack,
  style,
}) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const isSlidingRef = useRef(false);
  const latestValueRef = useRef(value);

  // keep ref in sync with prop value
  latestValueRef.current = value;

  const handleLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const valueToPosition = useCallback(
    (val: number) => {
      if (trackWidth <= 0) return 0;
      const clamped = clamp(val, minimumValue, maximumValue);
      const range = maximumValue - minimumValue || 1;
      const progress = (clamped - minimumValue) / range;
      return progress * trackWidth;
    },
    [trackWidth, minimumValue, maximumValue]
  );

  const positionToValue = useCallback(
    (x: number) => {
      if (trackWidth <= 0) return minimumValue;
      const clampedX = clamp(x, 0, trackWidth);
      const progress = clampedX / trackWidth;
      const rawValue =
        minimumValue + progress * (maximumValue - minimumValue);
      if (step && step > 0) {
        return clamp(
          roundToStep(rawValue, step),
          minimumValue,
          maximumValue
        );
      }
      return clamp(rawValue, minimumValue, maximumValue);
    },
    [trackWidth, minimumValue, maximumValue, step]
  );

  const updateFromGestureX = useCallback(
    (x: number, source: "move" | "start" | "end") => {
      const newValue = positionToValue(x);
      if (source === "start" && onSlidingStart) {
        onSlidingStart(newValue);
      }
      if ((source === "move" || source === "start") && onValueChange) {
        onValueChange(newValue);
      }
      if (source === "end" && onSlidingComplete) {
        onSlidingComplete(newValue);
      }
    },
    [onValueChange, onSlidingStart, onSlidingComplete, positionToValue]
  );

  const panResponder = useMemo<PanResponderInstance>(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,

        onPanResponderGrant: (evt, _gestureState) => {
          if (disabled || trackWidth <= 0) return;
          isSlidingRef.current = true;
          const x = evt.nativeEvent.locationX;
          updateFromGestureX(x, "start");
        },

        onPanResponderMove: (evt, gestureState) => {
          if (!isSlidingRef.current || disabled || trackWidth <= 0) return;
          // locationX is relative to the view handling the responder
          const x = evt.nativeEvent.locationX;
          updateFromGestureX(x, "move");
        },

        onPanResponderRelease: (evt, gestureState) => {
          if (!isSlidingRef.current || disabled || trackWidth <= 0) return;
          isSlidingRef.current = false;
          const x = evt.nativeEvent.locationX;
          updateFromGestureX(x, "end");
        },

        onPanResponderTerminate: (evt, gestureState) => {
          if (!isSlidingRef.current || disabled || trackWidth <= 0) return;
          isSlidingRef.current = false;
          const x = evt.nativeEvent.locationX;
          updateFromGestureX(x, "end");
        },
      }),
    [disabled, trackWidth, updateFromGestureX]
  );

  // Where should the thumb be?
  const thumbX = valueToPosition(latestValueRef.current);
  const range = maximumValue - minimumValue || 1;
  const progress = clamp(
    (latestValueRef.current - minimumValue) / range,
    0,
    1
  );

  return (
    <View
      style={[styles.container, style]}
      onLayout={handleLayout}
      {...panResponder.panHandlers}
    >
      {/* Track */}
      <View style={[styles.trackBase, { height: trackHeight }]}>
        {renderTrack ? (
          renderTrack({ progress })
        ) : (
          <>
            <View style={styles.trackBackground} />
            <View
              style={[
                styles.trackFilled,
                {
                  width: trackWidth * progress,
                },
              ]}
            />
          </>
        )}
      </View>

      {/* Thumb */}
      <View
        style={[
          styles.thumbContainer,
          {
            width: thumbSize,
            height: thumbSize,
            left: thumbX - thumbSize / 2,
          },
        ]}
        pointerEvents="none" // gestures handled by parent
      >
        {renderThumb ? (
          renderThumb()
        ) : (
          <View
            style={[
              styles.defaultThumb,
              { width: thumbSize, height: thumbSize, borderRadius: thumbSize / 2 },
            ]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
  },
  trackBase: {
    width: "100%",
    borderRadius: 999,
    overflow: "hidden",
  },
  trackBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
  },
  trackFilled: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
  thumbContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  defaultThumb: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#999",
  },
});

export default CustomSlider;
