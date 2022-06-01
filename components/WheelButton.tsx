import { View, StyleSheet, Text, PanResponder, Animated, Dimensions, TouchableOpacity, Button, TouchableWithoutFeedback, Pressable } from "react-native";
import { useState, useEffect } from "react";
import * as Haptics from 'expo-haptics';
import NativeIconicIcon from "./NativeIconicIcon";
import { Audio } from 'expo-av';
import { Sound } from "expo-av/build/Audio";
import { LinearGradient } from 'expo-linear-gradient';
import { Gyroscope } from "expo-sensors";

interface WheelButtonProps {
  name: string,
  onPressIn?: () => void,
  onPressOut?: () => void,
}

export default function WheelButton({ name, onPressIn, onPressOut }: WheelButtonProps) {

  const wheelButtonColor = '#aaa';
  const wheelButtonSize = 30;

  return (
    <View>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
        <NativeIconicIcon name={name} size={wheelButtonSize} color={wheelButtonColor} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
