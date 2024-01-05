import { View, Text ,StyleSheet,Dimensions} from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'
import Pdf from 'react-native-pdf';
const PdfShow = () => {
const {vidLink}=useRoute().params
  return (
    <View style={{flex:1}}>
      <Pdf
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