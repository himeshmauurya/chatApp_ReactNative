import {
    View,
    Modal,
    ActivityIndicator,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    TextInput,
    ToastAndroid,
  } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
  
      backgroundColor: '#181046',
      color: 'white',
    },
    header: {
      backgroundColor: 'black',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerbox: {
      height: 60,
      justifyContent: 'center',
      backgroundColor: 'black',
    },
    headerImg: {
      height: 50,
      width: 50,
      objectFit: 'contain',
    },
    revrow: {
      flexDirection: 'column-reverse',
    },
    userIcon: {
      height: 40,
      width: 40,
    },
    pdfImg: {
      height: 50,
      width: 50,
      resizeMode: 'contain',
    },
    pdftext: {
      color: 'white',
    },
    loadCont: {
      position: 'absolute',
      top: 90,
      left: 90,
    },
    loadpdf: {
      height: 50,
      width: 50,
      resizeMode: 'contain',
      marginRight: 20,
    },
    loadwidth: {
      width: 50,
    },
    clipImg: {
      height: 30,
      width: 40,
      resizeMode: 'contain',
    },
    rowItem: {
      flexDirection: 'row',
    },
    loadImgSize: {
      height: 200,
      width: 200,
    },
    userIconEye: {
      height: 20,
      width: 20,
    },
    chatContainer: {
      flex: 1,
      paddingHorizontal: 10,
      paddingBottom: 10,
    },
    messageBubble: {
      padding: 10,
      borderRadius: 10,
      maxWidth: '80%',
      marginVertical: 5,
    },
    sentBubble: {
      alignSelf: 'flex-end',
      backgroundColor: 'purple',
    },
    receivedBubble: {
      alignSelf: 'flex-start',
      backgroundColor: '#55190C',
    },
    messageText: {
      color: 'white',
      fontSize: 15,
    },
    chatFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: 'black',
      backgroundColor: 'black',
      color: 'black',
    },
    input: {
      flex: 1,
      height: 50,
      width: 150,
      // height: 100,
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 15,
      marginRight: 10,
      color: 'black',
      backgroundColor: 'white',
    },
    buttonFooterChat: {
      width: 70,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#007AFF',
    },
    textFooterChat: {
      color: 'white',
    },
    modal: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgb(128, 128, 128)',
      padding: 100,
    },
    text: {
      color: 'white',
      marginTop: 10,
      fontSize: 20,
    },
  });
  