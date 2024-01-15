import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const Login = () => {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const loginUser = () => {
    setVisible(true);
    firestore()
      .collection('users')
      .where('email', '==', email)
      .get()
      .then(res => {
        setVisible(false);
        goToNext(
          res.docs[0].data().name,
          res.docs[0].data().email,
          res.docs[0].data().userId,
        );
      })
      .catch(err => {
        setVisible(false);
        console.log(err);
        Alert.alert('User not found', email);
      });
    setEmail('');
    setPassword('');
  };

  const goToNext = async (name, email, userId) => {
    await AsyncStorage.setItem('NAME', name);
    await AsyncStorage.setItem('EMAIL', email);
    await AsyncStorage.setItem('USERID', userId);
    navigation.navigate('Main');
  };
  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Enter Email"
        style={[styles.input, styles.margTopLarge]}
        value={email}
        onChangeText={txt => {
          txt = txt.trim();
          setEmail(txt);
        }}
      />

      <TextInput
        placeholder="Enter Password"
        style={[styles.input, styles.margTopSmall]}
        value={password}
        onChangeText={txt => {
          txt = txt.trim();
          setPassword(txt);
        }}
      />

      <TouchableOpacity style={styles.btn} onPress={loginUser}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
      <Text
        onPress={() => {
          navigation.navigate('Signup');
        }}
        style={styles.orLogin}>
        Or Sign Up
      </Text>
      <Loader visible={visible} />
    </KeyboardAwareScrollView>
  );
};

export default Login;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181046',
    color: 'black',
  },
  title: {
    fontSize: 30,
    color: 'white',
    alignSelf: 'center',
    marginTop: 100,
    fontWeight: '600',
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    color: 'black',
    alignSelf: 'center',
    paddingLeft: 20,
    backgroundColor: 'white',
  },
  btn: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    backgroundColor: 'purple',
  },
  btnText: {
    color: 'white',
    fontSize: 20,
  },
  orLogin: {
    alignSelf: 'center',
    marginTop: 50,
    fontSize: 20,
    textDecorationLine: 'underline',
    fontWeight: '600',
    color: 'white',
  },
  margTopSmall: {
    marginTop: 20,
  },
  margTopLarge: {
    marginTop: 20,
  },
});
