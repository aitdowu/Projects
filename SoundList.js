import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Audio } from 'expo-av';

export const SoundList = () => {
 const soundData = [
    { sound: require('./assets/soundpack/3_10_120bpm_Em.wav'), label: 'Bass 1' },
    { sound: require('./assets/soundpack/5_2_165bpm_Am.wav'), label: 'Bass 2' },
    { sound: require('./assets/soundpack/6_3_165bpm_Gm.wav'), label: 'Bass 3' },
    { sound: require('./assets/soundpack/7_4_149bpm_Cm.wav'), label: 'Bass 4' },
    { sound: require('./assets/soundpack/12_8_160bpm_Cm.wav'), label: 'Bass 5' },
    { sound: require('./assets/soundpack/trap-rim-snare_135bpm.wav'), label: 'Snare 1' },
    { sound: require('./assets/soundpack/Hi-Hat.mp3'), label: 'Hi Hat 1' },
    { sound: require('./assets/soundpack/drum-loop.mp3'), label: 'Drum kit 1' },
    { sound: require('./assets/soundpack/China-Cymbal-Slide.mp3'), label: 'Cymbal 1' },
    { sound: require('./assets/soundpack/15_Bonus_1_120bpm_Em.wav'), label: 'Melody 1' },
    { sound: require('./assets/soundpack/16_Bonus_2_125bpm_Gm.wav'), label: 'Melody 2' },
    { sound: require('./assets/soundpack/17_Bonus_3_125bpm_Cm.wav'), label: 'Melody 3' },
    { sound: require('./assets/soundpack/18_Bonus_4_139bpm_Am.wav'), label: 'Melody 4' },
    { sound: require('./assets/soundpack/19_Bonus_5_155bpm_Am.wav'), label: 'Melody 5' },
  ];

  const renderButton = (item, index, playSound) => (
    <TouchableOpacity key={index} onPress={() => playSound(item.sound)} style={styles.button}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  const [soundObjects, setSoundObjects] = useState([]);

  const playSound = async (sound) => {
    const { sound: newSoundObject, status } = await Audio.Sound.createAsync(
      sound,
      { shouldPlay: true, isLooping: true }
    );

    setSoundObjects((prevSoundObjects) => [...prevSoundObjects, newSoundObject]);
  };

  const stopAllSounds = async () => {
    soundObjects.forEach(async (soundObject) => {
      await soundObject.stopAsync();
      await soundObject.unloadAsync();
    });
    setSoundObjects([]);
  };

  return {
    soundData,
    renderButton,
    playSound,
    stopAllSounds,
  };
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    margin: 10,
    backgroundColor: 'lightgray',
  },
});