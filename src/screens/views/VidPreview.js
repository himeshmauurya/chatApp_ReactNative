import React, {useRef, useState} from 'react';
import {View, TouchableOpacity, Text, Image} from 'react-native';
import Video from 'react-native-video';
import RNFS, {copyFile} from 'react-native-fs';
const VidPreview = props => {
  const videoRef = useRef(null);
  return (
    <View>
      <Video
        ref={videoRef}
        source={{
          uri: props.value,
        }}
        style={{width: 200, height: 150, backgroundColor: 'black'}}
        onLoad={() => {
          videoRef.current.seek(3);
        }}
        paused={true}
      />
      <View
        style={{
          position: 'absolute',
          top: 50,
          left: 80,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/videoImg/play-button.png')}
          style={{height: 40, width: 40}}
        />
      </View>
    </View>
  );
};

export default VidPreview;
