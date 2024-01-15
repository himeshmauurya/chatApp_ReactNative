import { StyleSheet } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

 export const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      color: 'black',
      backgroundColor: 'black',
    },
    image: {
      flex: 1,
      justifyContent: 'center',
    },
    firstnamechecktext: {
      color: 'red',
      maxWidth: '82%',
    },
    passinput: {
      flex: 1,
      marginLeft: 9,
      color:'black'
    },
    showtext5: {
      marginRight: 9,
      maxWidth: '82%',
    },
    hidetext5: {
      marginRight: 9,
    },
    passcheck5: {
      color: 'red',
      marginTop: 0,
      maxWidth: '82%',
    },
    profileImage: {
      width: '50%',
      height: hp('10%'),
      marginBottom: hp('8%'),
      objectFit: 'contain',
    },
    input: {
      height: hp('6%'),
  
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 5,
      paddingLeft: 10,
      color: 'black',
      backgroundColor: 'white',
    },
    sectionStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: 'black',
      height: hp('6%'),
      width: '80%',
      borderRadius: 5,
    },
    navback: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 60,
      width: '100%',
      backgroundColor: '#047BD5',
      padding: 5,
      marginTop: '-16%',
    },
    backimg: {
      height: hp('4%'),
      width: wp('8%'),
      objectFit: 'contain',
    },
    viewouter: {
      backgroundColor: '#181046',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
    },
    regtext: {
      fontSize: 30,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: hp('1%'),
      marginTop: hp('3%'),
    },
    signupouter: {
      backgroundColor: 'purple',
      padding: 10,
      borderRadius: 10,
      width: '80%',
    },
    signuptext: {
      color: 'white',
      textAlign: 'center',
    },
    golog: {
      marginTop: 9,
      color: 'white',
      fontSize: 20,
      marginBottom: 20,
    },
  });
  

  
  
  
  