import { View, Text, StyleSheet, PanResponder, Animated, Dimensions } from "react-native";
import { useRef, useState } from "react";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);
const wheelRadius = screenWidth * 0.8 / 2;
const wheelCenterRadius = wheelRadius * 0.6;
console.log(screenWidth);

export default function ClickWheel() {
  const position = useRef(new Animated.ValueXY()).current;
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  return (
    <View style={styles.container}>
      <View style={styles.wheel}>
      </View>
      <View style={styles.wheelCenter}>
      </View>
      <Animated.View
          style={[styles.touch, {
            transform: position.getTranslateTransform()
          }]}
          {...PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gesture) => {
              position.setValue({ x: lastPosition.x + gesture.dx, y: lastPosition.y + gesture.dy });
              
            },
            onPanResponderRelease: (e, gesture) => {
              setLastPosition({ x: lastPosition.x + gesture.dx, y: lastPosition.y + gesture.dy });
            }
          }).panHandlers}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  touch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000',
    zIndex: 1,
  },
});
