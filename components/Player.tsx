

import { View, Text, Button, Image, StyleSheet } from "react-native";
import getFavSongs from "../api/getFavSongs";
import { useState, useEffect } from "react";
import ClickWheel from "./ClickWheel";

interface PlayerProps {
  token: string;
}

export default function Player({token} : PlayerProps) {
  const songs = getFavSongs(token);
  
  const randomSong = songs[Math.floor(Math.random() * songs.length)];

  console.log("randomSong:", randomSong);
  console.log(randomSong.album.images[0].url);
  

  return (
    <View style={styles.playerContainer}>
      <Image source={{uri: randomSong.album.images[0].url}} style={styles.img} />
      <ClickWheel />
    </View>
  )
}

const styles = StyleSheet.create({
  playerContainer: {
    marginTop: -200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 300,
    height: 300,
  }
});

