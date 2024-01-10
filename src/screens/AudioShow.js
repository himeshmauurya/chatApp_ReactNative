import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  Platform,
  ToastAndroid,
  AlertIOS,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import {useRoute} from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import RNFS from 'react-native-fs';

const AudioShow = props => {
  const [paused, setPaused] = useState(true);
  const [progress, setProgress] = useState(null);
  const {downloadUrl, fileName, ext1, downloadResource1} = props;
  const [tog, setTog] = useState(true);
  const [load, setLoad] = useState(false);
  const ref = useRef();
  function notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(msg);
    }
  }
  let currUrl = useRef(downloadUrl);
  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  function checkFileExist(fileName, downloadUrl, ext1) {
  let downloadsPath = RNFS.DownloadDirectoryPath;
    if(Platform.OS === 'android'){

    }else{
      downloadsPath =  RNFS.DocumentDirectoryPath
    }
    RNFS.readDir(downloadsPath)
      .then(result => {
        const found = result.find(file => file.name === fileName);
        if (found) {
          console.log('File exists in Downloads folder:', found.path);
          const ext = found.path.split('.');
          if (ext[1] == 'mp3') {
            currUrl.current = found.path;
          }
        } else {
          console.log('File does not exist in Downloads folder', ext1);
          downloadResource1(downloadUrl);
        }
      })
      .catch(error => {
        console.error('Error reading Downloads folder:', error);
        notifyMessage('Error reading Downloads folder:');
      });
  }
  return (
    <View
      style={{
        width: 200,
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
      }}>
      <View style={{width: 40}}>
        <Video
          ref={ref}
          source={{
            uri: currUrl.current,
          }}
          paused={paused}
          playInBackground={false}
          playWhenInactive={false}
          onEnd={() => setPaused(true)}
          // controls
          onProgress={x => {
            setProgress(x);
          }}
        />
        <TouchableOpacity
          onPress={() => {
            if(tog){
              console.log("sddsdsdsdd")
              checkFileExist(fileName,downloadUrl,ext1);
              setTog(false);
            }

            setPaused(!paused);
          }}>
          <Image
            source={
              paused
                ? require('../assets/videoImg/play-button.png')
                : require('../assets/videoImg/pause.png')
            }
            style={{
              width: 30,
              height: 30,
              tintColor: 'black',
              // marginLeft: 50,
            }}
          />
        </TouchableOpacity>
      </View>

      {progress ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{color: 'red'}}>{format(progress.currentTime)}</Text>
          <Slider
            style={{width: '50%', height: 40}}
            minimumValue={0}
            maximumValue={progress.seekableDuration}
            value={progress.currentTime}
            minimumTrackTintColor="black"
            maximumTrackTintColor="black"
            onValueChange={x => {
              ref.current.seek(x);
            }}
          />
          <Text style={{color: 'black'}}>
         {format(progress.seekableDuration)}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default AudioShow;
