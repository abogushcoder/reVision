import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

export default function AppText(props: TextProps) {
  return (
    <RNText
      {...props}
      style={[{ fontFamily: 'Jersey20-Regular' }, props.style]}
    />
  );
}

