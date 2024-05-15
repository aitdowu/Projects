/** import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, TextInput, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getDatabase } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { Audio } from 'expo-av';

export default function RecordButton() {
  const [recording, setRecording] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState('idle');
  const [audioPermission, setAudioPermission] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    async function getPermission() {
      try {
        const { granted } = await Audio.requestPermissionsAsync();
        console.log('Permission Granted: ' + granted);
        setAudioPermission(granted);
      } catch (error) {
        console.error(error);
      }
    }

    getPermission();

    return () => {
      if (recordingStatus === 'recording') {
        stopRecording();
      }
    };
  }, [recordingStatus]);

  async function startRecording() {
    try {
      if (audioPermission) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }

      const newRecording = new Audio.Recording();
      console.log('Starting Recording');
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setRecordingStatus('recording');
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }

  async function stopRecording() {
    try {
      if (recordingStatus === 'recording' && recording) {
        console.log('Stopping recording');
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        // Use the specified file name or a default timestamp
        const fileNameToUse = fileName.trim() || `recording_${Date.now()}`;

        // Determine the correct file extension based on your recording options
        const fileExtension = '.m4a'; // Adjust based on your recording format

        // Upload the recording to Firebase Storage
        const storage = getStorage();
        const storageReference = storageRef(storage, `recordings/${fileNameToUse}${fileExtension}`);
        const response = await fetch(uri);
        const blob = await response.blob();

        await uploadBytes(storageReference, blob);

        // Reset states to record again
        setRecording(null);
        setRecordingStatus('stopped');
        setFileName('');
      } else {
        console.log('Recording is not in progress or already stopped');
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }

  async function handleRecordingButtonPress() {
    if (recording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleRecordingButtonPress}>
        <FontAwesome name={recording ? 'stop-circle' : 'circle'} size={20} color="white" />
      </TouchableOpacity>
      {recordingStatus === 'stopped' && (
        <View style={styles.fileNameInputContainer}>
          <TextInput
            style={styles.fileNameInput}
            placeholder="Enter file name"
            value={fileName}
            onChangeText={(text) => setFileName(text)}
          />
        </View>
      )}
      <Text style={styles.recordingStatusText}>{`Recording status: ${recordingStatus}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'red',
    marginBottom: 10,
  },
  fileNameInputContainer: {
    marginTop: 10,
  },
  fileNameInput: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  recordingStatusText: {
    marginTop: 16,
    color: 'white', 
  },
});

// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyDMuTeUMrkbjwO-9u-hsgF92ZAqs1SrB8I",
  authDomain: "beatmaker-app.firebaseapp.com",
  projectId: "beatmaker-app",
  storageBucket: "beatmaker-app.appspot.com",
  messagingSenderId: "327103737329",
  appId: "1:327103737329:web:8da4cf338476321b52a850",
  measurementId: "G-EEK9DZ86TL",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
**/
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, TextInput, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Recorder, Player } from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new Recorder();
const audioPlayer = new Player();

export default function RecordButton() {
  const [recordingStatus, setRecordingStatus] = useState('idle');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopRecorder();
      audioPlayer.stopPlayer();
    };
  }, []);

  const startRecording = async () => {
    setRecordingStatus('recording');
    const uri = await audioRecorderPlayer.startRecorder();
    console.log('Recording started:', uri);
  };

  const stopRecording = async () => {
    const uri = await audioRecorderPlayer.stopRecorder();
    setRecordingStatus('stopped');

    // Use the specified file name or a default timestamp
    const fileNameToUse = fileName.trim() || `recording_${Date.now()}`;
    const fileExtension = '.mp3';

    // Save the recording to local file
    const localUri = `${Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY.outputFormat === Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_2_TS ? uri.slice(0, -3) : uri}${fileExtension}`;
    console.log('Recording saved to local file:', localUri);

    // Reset states
    setFileName('');

    // You can now upload the localUri to Firebase Storage or perform other actions
  };

  const handleRecordingButtonPress = async () => {
    if (recordingStatus === 'idle') {
      await startRecording();
    } else if (recordingStatus === 'recording') {
      await stopRecording();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleRecordingButtonPress}>
        <FontAwesome name={recordingStatus === 'recording' ? 'stop-circle' : 'circle'} size={20} color="white" />
      </TouchableOpacity>
      {recordingStatus === 'stopped' && (
        <View style={styles.fileNameInputContainer}>
          <TextInput
            style={styles.fileNameInput}
            placeholder="Enter file name"
            value={fileName}
            onChangeText={(text) => setFileName(text)}
          />
        </View>
      )}
      <Text style={styles.recordingStatusText}>{`Recording status: ${recordingStatus}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'red',
    marginBottom: 10,
  },
  fileNameInputContainer: {
    marginTop: 10,
  },
  fileNameInput: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  recordingStatusText: {
    marginTop: 16,
    color: 'white',
  },
});

