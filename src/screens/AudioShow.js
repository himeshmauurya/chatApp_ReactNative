import React from 'react';
import { SafeAreaView } from 'react-native';
import { View, TouchableOpacity, Text } from 'react-native';
import Video from 'react-native-video';
import { useRoute } from '@react-navigation/native'
const AudioShow = () => {
  
  const [paused, setPaused] = React.useState(false);
  const {vidLink}=useRoute().params
  return (
    <SafeAreaView>
      <View style={{backgroundColor:'black',height:'100%',justifyContent:'center',alignItems:'center'}}>  
      <Video
         source={{
            uri:`${vidLink}`,
           }}
        paused={paused}
        playInBackground={false}
        playWhenInactive={false}
        onEnd={() => setPaused(true)}
      />
      <TouchableOpacity onPress={() => setPaused(!paused)}>
        <Text style={{fontSize:50,color:'white'}}>{paused ? 'Play' : 'Pause'}</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

export default AudioShow;
