import { View, Text ,StyleSheet,Dimensions,TouchableOpacity,Image} from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import Pdf from 'react-native-pdf';
const PdfShow = () => {
const {vidLink}=useRoute().params
const navigation=useNavigation()
  return (
    <View style={{flex:1}}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            height: '60',
            justifyContent: 'center',
            backgroundColor: 'black',
          }}>
          <Image
            source={require('../../images/back-1.png')}
            style={{height: 50, width: 50, objectFit: 'contain'}}
          />
        </TouchableOpacity>
      <Pdf
      trustAllCerts={false}
                    source={{uri:vidLink}}
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                style={styles.pdf}
                    />
    </View>
  )
}

export default PdfShow
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});