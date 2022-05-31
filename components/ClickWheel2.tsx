import { View, Text, StyleSheet, PanResponder, Animated, Dimensions, TouchableOpacity, } from "react-native";
import { useRef, useState, useEffect } from "react";
import Icon from "../icon";
import Svg, {
  G,
  Path,
  LinearGradient,
  Stop
} from "react-native-svg";
import * as Haptics from 'expo-haptics';
import NativeIconicIcon from "./NativeIconicIcon";
import { Audio } from 'expo-av';
import { Sound } from "expo-av/build/Audio";


const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);
const wheelRadius = screenWidth * 0.8 / 2;
const wheelCenterRadius = wheelRadius * 0.6;

const convertXYToAngle = (x: number, y: number, center: { x: number, y: number }) => {
  const angle = Math.atan2(y - center.y, x - center.x);
  return angle * (180 / Math.PI);
};

export default function ClickWheel2() {
  const [currAngle, setCurrAngle] = useState(0);
  const [initialAngle, setInitialAngle] = useState(0);
  const [currRangeIndex, setCurrRangeIndex] = useState(0);
  const [lastRangeIndex, setLastRangeIndex] = useState(0);

  const [mySound, setMySound] = useState<Sound | null>(null);
  const [playing, setPlaying] = useState(false);


  const angleDiff = currAngle - initialAngle;

  if (Math.floor(angleDiff / 10) !== currRangeIndex) {
    setCurrRangeIndex(Math.floor(angleDiff / 10));
    Haptics.selectionAsync();
  }

  const playSound = async () => {
    if (mySound) {
      await mySound.playAsync();
    } else {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/杨宗纬-最爱.mp3'));
      setMySound(sound);
      await sound.playAsync();
    }
    console.log('Playing Sound');
    setPlaying(true);

  }

  const pause = async () => {
    if (mySound) {
      await mySound.pauseAsync();
      setPlaying(false);
    }
  }

  const tryChangeVolume = async (increment: boolean) => {
    if (mySound) {
      const status = await mySound.getStatusAsync();
      if (status.isLoaded) {
        const newVolume = increment ? status.volume + 1 / 36 : status.volume - 1 / 36;
        if (newVolume >= 0 && newVolume <= 1) {
          console.log('Changing Volume to: ', newVolume);
          await mySound.setVolumeAsync(newVolume);
        } else {
          console.log('Volume out of range');
        }
      }
    }
  }

  useEffect(() => {
    return mySound ? () => {
      console.log('Unloading Sound');
      mySound.unloadAsync();
    } : undefined;
  }, [mySound]);

  useEffect(() => {
    if (mySound) {
      console.log(currRangeIndex - lastRangeIndex);
      if (currRangeIndex !== lastRangeIndex && currRangeIndex !== 0) {
        if (Math.abs(currRangeIndex - lastRangeIndex) === 1) {
          console.log('try changing Volume: ', currRangeIndex, lastRangeIndex);
          tryChangeVolume(currRangeIndex > lastRangeIndex);
        }
        setLastRangeIndex(currRangeIndex);
      }
    }
  }, [currRangeIndex]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.wheel, {
          transform: [{ rotate: angleDiff.toString() + "deg" }]
        }]}
        {...PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onPanResponderStart: (e, gesture) => {
            setInitialAngle(convertXYToAngle(gesture.x0, gesture.y0, { x: screenWidth / 2, y: screenHeight / 2 }));
            setCurrAngle(convertXYToAngle(gesture.x0, gesture.y0, { x: screenWidth / 2, y: screenHeight / 2 }));
          },
          onPanResponderMove: (e, gesture) => {
            setCurrAngle(convertXYToAngle(gesture.moveX, gesture.moveY, { x: screenWidth / 2, y: screenHeight / 2 }));
          },
          onPanResponderRelease: (e, gesture) => {
            setCurrAngle(0);
            setInitialAngle(0);
          }
        }).panHandlers}
      >
       {/*} 
        <Svg width="100%" height="100%" viewBox="0 0 955 955">
          <G id="layer_2">
            <G id="layer_1-2">
              <LinearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="477.3691" y1="0.2666" x2="477.3691" y2="955">
                <Stop offset="0" stopColor="#5896D0" />
                <Stop offset="0.2815" stopColor="#3D8CCB" />
                <Stop offset="0.5674" stopColor="#1E80C6" />
                <Stop offset="0.8652" stopColor="#0060ff" />
                <Stop offset="0.8652" stopColor="#0060AD"/>
                <Stop offset="0.9944" stopColor="#004886" />
              </LinearGradient>
              <Path fill="url(#SVGID_1_)" d="M477.4,955C214.1,955,0,740.9,0,477.6S214.1,0.3,477.4,0.3s477.4,214.1,477.4,477.4S740.6,955,477.4,955z
	 M477.4,178.6c-164.9,0-299,134.1-299,299s134.1,299,299,299s299-134.1,299-299S642.2,178.6,477.4,178.6z"/>
            </G>
          </G>
      </Svg>*/}

      </Animated.View>
      <View style={styles.wheelCenter}>
        <TouchableOpacity onPress={() => {
          if (playing) pause();
          else playSound();
        }}>
          <NativeIconicIcon name="play-outline" size={wheelCenterRadius} color="#aaa" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    position: "absolute",
    top: -300,
    fontSize: 30,
    color: '#000',
  },
  wheel: {
    position: 'absolute',
    width: wheelRadius * 2,
    height: wheelRadius * 2,
    borderRadius: wheelRadius,
    backgroundColor: '#ccc',
  },
  wheelCenter: {
    position: 'absolute',
    width: wheelCenterRadius * 2,
    height: wheelCenterRadius * 2,
    borderRadius: wheelCenterRadius,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  touch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000',
    zIndex: 1,
  },
});
