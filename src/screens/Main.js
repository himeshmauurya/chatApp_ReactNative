import {View, Text, StyleSheet, TouchableOpacity, Image,Platform} from 'react-native';
import React, {useState, useEffect} from 'react';
import Users from '../tabs/Users';
import Setting from '../tabs/Setting';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

const Main = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  useEffect(() => {
    if (Platform.OS === 'android') {
      check(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE &&
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      )
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log(
                'This feature is not available (on this device / in this context)',
              );
              break;
            case RESULTS.DENIED:
              request(
                PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE &&
                  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
              ).then(result => {
                console.log(result, 'result after asking permission');
                if (result === 'granted' || Platform.Version >= 33) {
                  console.log('Platform.Version>', Platform.Version);
                } else if (result === 'blocked') {
                  console.log(
                    'Permission Denied: Some features need external storage access. Grant permission in device settings for full functionality.',
                  );
                }
              });
              console.log(
                'The permission has not been requested / is denied but requestable',
                result,
              );
              break;
            case RESULTS.LIMITED:
              console.log(
                'The permission is limited: some actions are possible',
              );
              break;
            case RESULTS.GRANTED:
              console.log('The permission is granted');
              break;
            case RESULTS.BLOCKED:
              console.log(
                'The permission is denied and not requestable anymore',
              );
              break;
          }
        })
        .catch(error => {
          console.log('error occurred', error);
        });
    } else if (Platform.OS === 'ios') {
    }
  }, []);

  // useEffect(() => {
  //   if (Platform.OS === 'android' && Platform.Version >= 33) {
  //     check(
  //       PERMISSIONS.ANDROID.READ_MEDIA_IMAGES &&
  //         PERMISSIONS.ANDROID.READ_MEDIA_AUDIO&&
  //         PERMISSIONS.ANDROID.READ_MEDIA_VIDEO
  //     )
  //       .then(result => {
  //         switch (result) {
  //           case RESULTS.UNAVAILABLE:
  //             console.log(
  //               'This feature is not available (on this device / in this context1)',
  //             );
  //             break;
  //           case RESULTS.DENIED:
  //             request(
  //               PERMISSIONS.ANDROID.READ_MEDIA_IMAGES &&
  //         PERMISSIONS.ANDROID.READ_MEDIA_AUDIO&&
  //         PERMISSIONS.ANDROID.READ_MEDIA_VIDEO
  //             ).then(result => {
  //               console.log(result, 'result after asking permission');
  //               if (result === 'granted' || Platform.Version >= 33) {
  //                 console.log('Platform.Version>', Platform.Version);
  //               } else if (result === 'blocked') {
  //                 console.log(
  //                   'Permission Denied: Some features need external storage access. Grant permission in device settings for full functionality.',
  //                 );
  //               }
  //             });
  //             console.log(
  //               'The permission has not been requested / is denied but requestable',
  //               result,
  //             );
  //             break;
  //           case RESULTS.LIMITED:
  //             console.log(
  //               'The permission is limited: some actions are possible',
  //             );
  //             break;
  //           case RESULTS.GRANTED:
  //             console.log('The permission is granted');
  //             break;
  //           case RESULTS.BLOCKED:
  //             console.log(
  //               'The permission is denied and not requestable anymore',
  //             );
  //             break;
  //         }
  //       })
  //       .catch(error => {
  //         console.log('error occurred', error);
  //       });
  //   } else if (Platform.OS === 'ios') {
  //   }
  // }, []);
  return (
    <View style={styles.container}>
      {selectedTab == 0 ? <Users /> : <Setting />}
      <View style={styles.bottomTab}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setSelectedTab(0);
          }}>
          <Image
            source={require('../images/group.png')}
            style={[
              styles.tabIcon,
              {tintColor: selectedTab == 0 ? 'white' : '#A09F9F'},
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setSelectedTab(1);
          }}>
          <Image
            source={require('../images/settings.png')}
            style={[
              styles.tabIcon,
              {tintColor: selectedTab == 1 ? 'white' : '#A09F9F'},
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Main;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: 'purple',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  tab: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    width: 30,
    height: 30,
  },
});
