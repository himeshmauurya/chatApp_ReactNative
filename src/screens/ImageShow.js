import {
  StyleSheet,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';

const ImageShow = () => {
  const {vidLink} = useRoute().params;
console.log("vidlink",vidLink)
  return (
    <>
      <Animated.Image
        //  source={{uri:`file://${vidLink}`}}
        source={{
          uri: vidLink.startsWith('https') ? vidLink : `file://${vidLink}`,
        }}
        style={[StyleSheet.absoluteFillObject]}
      />
    </>
  );
};

export default ImageShow;
const styles = StyleSheet.create({});
