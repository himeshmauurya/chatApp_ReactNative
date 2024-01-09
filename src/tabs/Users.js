import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
let id=''
const Users = () => {
  const [users, setUsers] = useState([]);
  const navigation=useNavigation()
  useEffect(() => {
    getUsers();
  }, []);
  const getUsers = async () => {
    id = await AsyncStorage.getItem('USERID');
    let tempData = [];
    const email = await AsyncStorage.getItem('EMAIL');
    
    firestore()
      .collection('users')
      .where('email', '!=', email)
      .get()
      .then(res => {
        res.docs.map(item => {
          tempData.push(item.data());
        });
        setUsers(tempData);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat App</Text>
      </View>
      <FlatList
        data={users}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity style={styles.userItem} onPress={()=>{
               navigation.navigate("Chat",{data:item,id:id})
            }}>
              <Image
                source={require('../images/profile.png')}
                style={styles.userIcon}
              />
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Users;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'purple',
    fontSize: 20,
    fontWeight: '600',
  },
  userItem: {
    width: Dimensions.get('window').width - 50,
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    height: 60,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingLeft: 20,
    alignItems: 'center',
  },
  userIcon: {
    height: 40,
    width: 40,
  },
  name: {
    color: 'black',
    marginLeft: 20,
    fontSize: 20,
  },
});
