import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { styles } from './SignupStyle';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Signup = () => {
  const navigation = useNavigation();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confpassword, setConfPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [firstnamecheck, setFirstnamecheck] = useState(false);
  const [lastnamecheck, setLastnamecheck] = useState(false);
  const [mailcheck, setMailcheck] = useState(false);
  const [passcheck, setPasscheck] = useState(false);
  const [confpasscheck, setConfPasscheck] = useState(false);
  const [matchpasscheck, setmatchPasscheck] = useState(false);
  const [dissignup, setDissignup] = useState(true);
  const [checkblur, setCheckBlur] = useState(true);
  const [lastblur, setLastBlur] = useState(true);
  const [emailblur, setEmailBlur] = useState(true);
  const [passblur, setPassBlur] = useState(true);

  const handleSignup = () => {
    if (
      firstname === '' ||
      lastname === '' ||
      email === '' ||
      password === '' ||
      confpassword === ''
    ) {
      Alert.alert('Please fill all the Fields');
      return;
    }
    if(password!=confpassword){
      Alert.alert('Password do not match');
      return;
    }
    const userId = uuid.v4();
    firestore()
    .collection('users')
    .doc(userId)
    .set({
      name: firstname,
      email: email.toLowerCase(),
      password: password,
    //   mobile: mobile,
      userId: userId,
    })
    .then(res => {
      console.log('user created');
    //   setName('');
    //   setEmail('');
    // //   setMobile('');
    //   setPassword('');
    //   setConfirmPassword('');
      navigation.navigate('Login');
    })
    .catch(err => {
      console.log(err);
    });
  };

  const handleImageClick = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleImageClick1 = () => {
    setIsPasswordVisible1(!isPasswordVisible1);
  };

  const handleEnterPress = () => {
    if (password !== confpassword) {
      Alert.alert('please match the passwords');
    }
  };
  const goBackPage = () => {
    navigation.goBack();
  };
  const blurFirstName = () => {
    const nameRegex = /^[a-zA-Z]+[a-zA-Z]+$/;
    let len = firstname.length;

    if (!nameRegex.test(firstname) || len > 30) {
      setFirstnamecheck(true);
    } else {
      setFirstnamecheck(false);
    }

    setCheckBlur(false);
  };
  const changeFirstName = text => {
    if (text.endsWith(' ')) {
      setFirstname(text.trimEnd());
      return;
    }
    const nameRegex = /^[a-zA-Z]+[a-zA-Z]+$/;
    let len = text.length;

    if (!nameRegex.test(text) || len > 30) {
      setFirstnamecheck(true);
    } else {
      setFirstnamecheck(false);
    }

    setFirstname(text.trim());
  };

  const blurLastName = () => {
    const nameRegex = /^[a-zA-Z]+[a-zA-Z]+$/;
    let len = lastname.length;

    if (!nameRegex.test(lastname) || len > 30) {
      setLastnamecheck(true);
    } else {
      setLastnamecheck(false);
    }

    setLastBlur(false);
  };

  const changeLastName = text => {
    if (text.endsWith(' ')) {
      setLastname(text.trimEnd());
      return;
    }
    const nameRegex = /^[a-zA-Z]+[a-zA-Z]+$/;
    let len = text.length;

    if (!nameRegex.test(text) || len > 30) {
      setLastnamecheck(true);
    } else {
      setLastnamecheck(false);
    }

    setLastname(text.trim());
  };
  const blurEmail = () => {
    const emailRegex = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

    if (!emailRegex.test(email)) {
      setMailcheck(true);
    } else {
      setMailcheck(false);
    }

    setEmailBlur(false);
  };

  const changeEmail = text => {
    if (text.endsWith(' ')) {
      setEmail(text.trimEnd());
      return;
    }
    const emailRegex = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

    if (!emailRegex.test(text)) {
      setMailcheck(true);
    } else {
      setMailcheck(false);
    }

    setEmail(text.trim());
  };

  const blurPass = () => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasscheck(true);
    } else {
      setPasscheck(false);
    }

    setPassBlur(false);
  };

  const changePass = text => {
    if (text.endsWith(' ')) {
      setPassword(text.trimEnd());
      return;
    }
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(text)) {
      setPasscheck(true);
    } else {
      setPasscheck(false);
    }

    setPassword(text.trim());
  };

  const changeConfPass = text => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(text)) {
      setConfPasscheck(true);
    } else {
      setConfPasscheck(false);
    }

    setConfPassword(text);
  };
  const gotolog = () => {
    navigation.navigate('Login');
  };
  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.viewouter}>
        <Text style={styles.regtext}>Register Now</Text>
        <View style={{margin: 30}}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            spellCheck={false}
            autoCapitalize="none"
            value={firstname}
            onBlur={blurFirstName}
            onChangeText={changeFirstName}
          />
          {firstnamecheck ? (
            <Text style={styles.firstnamechecktext}>
              Name should be a minimum of 2 characters, and it should not
              contain numbers, spaces, or special characters. Maximum character
              limit is 30.
            </Text>
          ) : (
            <Text></Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastname}
            autoCapitalize="none"
            spellCheck={false}
            onBlur={blurLastName}
            onChangeText={changeLastName}
          />
          {lastnamecheck ? (
            <Text style={styles.firstnamechecktext}>
              Name should be a minimum of 2 characters, and it should not
              contain numbers, spaces, or special characters. Maximum character
              limit is 30.
            </Text>
          ) : (
            <Text></Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            spellCheck={false}
            onBlur={blurEmail}
            onChangeText={changeEmail}
            keyboardType="email-address"
          />
          {mailcheck ? (
            <Text style={styles.firstnamechecktext}>
              Email should follow the format abc@xyz.com.
            </Text>
          ) : (
            <Text></Text>
          )}
          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.passinput}
              placeholder="Password"
              autoCapitalize="none"
              onBlur={blurPass}
              onChangeText={changePass}
              secureTextEntry={!isPasswordVisible}
            />

            <TouchableOpacity onPress={handleImageClick}>
              {!isPasswordVisible ? (
                <Text style={styles.showtext5}>Show</Text>
              ) : (
                <Text style={styles.hidetext5}>Hide</Text>
              )}
            </TouchableOpacity>
          </View>
          {passcheck ? (
            <Text style={styles.passcheck5}>
              A password should contain at least eight characters, including at
              least one number, and include both lowercase and uppercase letters
              and special characters.
            </Text>
          ) : (
            <Text></Text>
          )}

          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.passinput}
              placeholder="Confirm Password"
              autoCapitalize="none"
              onChangeText={changeConfPass}
              secureTextEntry={!isPasswordVisible1}
              onEndEditing={handleEnterPress}
            />

            <TouchableOpacity onPress={handleImageClick1}>
              {!isPasswordVisible1 ? (
                <Text style={styles.hidetext5}>Show</Text>
              ) : (
                <Text style={styles.hidetext5}>Hide</Text>
              )}
            </TouchableOpacity>
          </View>
          {confpasscheck ? (
            <Text style={styles.passcheck5}>
              A password should contain at least eight characters, including at
              least one number, and include both lowercase and uppercase letters
              and special characters.
            </Text>
          ) : (
            <Text></Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSignup}
          activeOpacity={0.7}
          style={styles.signupouter}>
          <Text style={styles.signuptext}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={gotolog}>
          <Text style={styles.golog}>Go to login page</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

 export default Signup;



