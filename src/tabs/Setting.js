import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
const Setting = () => {
  const navigation = useNavigation();
  const removeUser = async () => {
    await AsyncStorage.removeItem('NAME');
    await AsyncStorage.removeItem('EMAIL');
    await AsyncStorage.removeItem('USERID');
    navigation.navigate('Login');
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={removeUser}>
        <Text style={styles.signout}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Setting;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signout:{
    color: 'white', fontSize: 20
  }
});
