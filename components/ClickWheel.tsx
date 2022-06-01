import { View, StyleSheet, Text, PanResponder, Animated, Dimensions, TouchableOpacity, Button, TouchableHighlight, TouchableWithoutFeedback, Pressable } from "react-native";
import { useState, useEffect } from "react";
import * as Haptics from 'expo-haptics';
import NativeIconicIcon from "./NativeIconicIcon";
import { Audio } from 'expo-av';
import { Sound } from "expo-av/build/Audio";
import { LinearGradient } from 'expo-linear-gradient';
import { Gyroscope } from "expo-sensors";
import WheelButton from "./WheelButton";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);
const wheelRadius = screenWidth * 0.7 / 2;
const wheelCenterRadius = wheelRadius * 0.7;

const wheelCenterYOffset = 150;

const convertXYToAngle = (x: number, y: number, center: { x: number, y: number }) => {
  //console.log(`x: ${x.toFixed(0)}, y: ${y.toFixed(0)}, center: ${center.x.toFixed(0)}, ${center.y.toFixed(0)}`);
  const angle = Math.atan2(y - center.y, x - center.x);
  return angle * (180 / Math.PI);
};


export default function ClickWheel() {
  const [currAngle, setCurrAngle] = useState(0);
  const [initialAngle, setInitialAngle] = useState(0);
  const [currRangeIndex, setCurrRangeIndex] = useState(0);
  const [lastRangeIndex, setLastRangeIndex] = useState(0);

  const [mySound, setMySound] = useState<Sound | null>(null);
  const [playing, setPlaying] = useState(false);

  /*
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [gyroSubscription, setGyroSubscription] = useState<any>(null);

  useEffect(() => {
    setGyroSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setGyroscopeData(gyroscopeData);
      })
    );
    return () => {
      gyroSubscription && gyroSubscription.remove();
      setGyroSubscription(null);
    };
  }, []);
  */

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
      //console.log(currRangeIndex - lastRangeIndex);
      if (currRangeIndex !== lastRangeIndex && currRangeIndex !== 0) {
        if (Math.abs(currRangeIndex - lastRangeIndex) === 1) {
          //console.log('try changing Volume: ', currRangeIndex, lastRangeIndex);
          tryChangeVolume(currRangeIndex > lastRangeIndex);
        }
        setLastRangeIndex(currRangeIndex);
      }
    }
  }, [currRangeIndex]);



  return (
    <View style={styles.container}>

      <Animated.View
        style={styles.wheel}
        {...PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onPanResponderStart: (e, gesture) => {
            setInitialAngle(convertXYToAngle(gesture.x0, gesture.y0, { x: screenWidth / 2, y: screenHeight / 2 + wheelCenterYOffset }));
            setCurrAngle(convertXYToAngle(gesture.x0, gesture.y0, { x: screenWidth / 2, y: screenHeight / 2 + wheelCenterYOffset }));
          },
          onPanResponderMove: (e, gesture) => {
            setCurrAngle(convertXYToAngle(gesture.moveX, gesture.moveY, { x: screenWidth / 2, y: screenHeight / 2 + wheelCenterYOffset }));
          },
          onPanResponderRelease: (e, gesture) => {
            setCurrAngle(0);
            setInitialAngle(0);
          }
        }).panHandlers}
      >
        {/*
        <View style={styles.buttonBottom}>
          <WheelButton name={'pause-outline'} onPressIn={() => {
            if (playing) pause();
            else playSound();
          }} />
        </View>
        <View style={styles.buttonRight}>
          <WheelButton name={'play-skip-forward'} />
        </View>
        <View style={styles.buttonLeft}>
          <WheelButton name={'play-skip-back'} />
        </View>
        <View style={styles.buttonTop}>
          <WheelButton name={'menu'} />
        </View>
        */}
      </Animated.View>
      <TouchableOpacity
        onPressIn={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
        onPressOut={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          if (playing) pause();
          else playSound();
        }}
      >
        <LinearGradient
          colors={["#aaa", "#eee"]}
          style={styles.wheelCenter}
        />
      </TouchableOpacity>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    top: wheelCenterYOffset,
  },
  text: {
    position: 'absolute',
    top: -200,
    fontSize: 20,
    color: '#000',
  },
  wheel: {
    position: 'absolute',
    width: wheelRadius * 2,
    height: wheelRadius * 2,
    borderRadius: wheelRadius,
    backgroundColor: '#fff',
    marginTop: wheelCenterYOffset
  },
  wheelCenter: {
    width: wheelCenterRadius,
    height: wheelCenterRadius,
    borderRadius: wheelCenterRadius,
    paddingLeft: 10,
  },
  buttonTop: {
    position: 'absolute',
    top: 30,
    left: wheelCenterRadius + 25,
  },
  buttonBottom: {
    position: 'absolute',
    bottom: 30,
    left: wheelCenterRadius + 25,
  },
  buttonLeft: {
    position: 'absolute',
    top: wheelCenterRadius + 25,
    left: 30,
  },
  buttonRight: {
    position: 'absolute',
    top: wheelCenterRadius + 25,
    right: 30,
  },

});
