import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ImageBackground } from 'react-native';
import { SoundList } from './SoundList';
import RecordButton from './RecordButton';
import { onValue, off, getDatabase, ref, getStorage, initializeApp, uploadBytes } from 'firebase/database';
import { initializeApp as initializeFirebaseApp } from 'firebase/app';
import { getStorage as getFirebaseStorage } from 'firebase/storage';

// Import your background image
import backgroundImage from './assets/recording-studio-background.jpg'; // Replace with the actual path

export default function App() {
  const { soundData, renderButton, playSound, stopAllSounds } = SoundList();
  const recordingsRef = useRef(null);
  const storageRef = useRef(null);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyDMuTeUMrkbjwO-9u-hsgF92ZAqs1SrB8I",
      authDomain: "beatmaker-app.firebaseapp.com",
      projectId: "beatmaker-app",
      storageBucket: "beatmaker-app.appspot.com",
      messagingSenderId: "327103737329",
      appId: "1:327103737329:web:8da4cf338476321b52a850",
      measurementId: "G-EEK9DZ86TL"
    };

    const app = initializeFirebaseApp(firebaseConfig);
    const database = getDatabase(app);
    const storage = getFirebaseStorage(app);

    recordingsRef.current = ref(database, 'recordings');
    storageRef.current = storage;

    return () => {
      off(recordingsRef.current, 'value', recordingsListener);
    };
  }, []);

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.grid}>
          {soundData.map((item, index) => renderButton(item, index, playSound))}
        </View>
        <View style={styles.buttonsContainer}>
          <RecordButton recordingsRef={recordingsRef.current} storageRef={storageRef.current} />
          <TouchableOpacity onPress={stopAllSounds} style={styles.button}>
            <Text>Stop All Sounds</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '80%',
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 10,
    margin: 10,
    backgroundColor: '#3498db', 
    elevation: 5, 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
