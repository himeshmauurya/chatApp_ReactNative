import {View, Text, Image} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const Imgview = props => {
  const imageUri = props.val;
  const localImg1 = useRef(imageUri);
  const [tog, settog] = useState(true);
  useEffect(() => {
    async function abc() {
      try {
        let result = await ImageResizer.createResizedImage(
          imageUri,
          80,
          80,
          'JPEG',
          80,
          0,
          undefined,
          false,
          {
            mode: 'contain',
            // onlyScaleDown,
          },
        );
        console.log(result, 'll');
        localImg1.current = result.uri;
        //   setp(result.uri)
        //settog(false);
      } catch (error) {
        console.log('Unable to resize the photo');
        // console.log(imageUri)
      }
    }
   
      abc();
   
  }, []);

  return (
    <View>
        <Image
          source={{uri: localImg1.current}}
          style={{height: 200, width: 200}}
        />
    </View>
  );
};

export default Imgview;
