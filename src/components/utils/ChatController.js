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
  import React, {useState, useEffect, useRef} from 'react';
  import {useNavigation, useRoute} from '@react-navigation/native';
  import firestore from '@react-native-firebase/firestore';
  import * as DocumentPicker from 'react-native-document-picker';
  import storage from '@react-native-firebase/storage';
  import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
  import {Platform} from 'react-native';
  import RNFS from 'react-native-fs';
  import Toast from 'react-native-toast-message';
  import VidPreview from '../../screens/views/VidPreview';
  import PdfShow from '../../screens/views/PdfShow';
  import AudioShow from '../../screens/views/AudioShow';

//const navigation=useNavigation()
  export const p1=()=>{
  console.log('send1')
  }
  export const p2=()=>{
    console.log('send2')
    }

    export const notifyMessage=(msg)=> {
        if (Platform.OS === 'android') {
          ToastAndroid.show(msg, ToastAndroid.SHORT);
        } else {
          Toast.show({
            type: 'success',
            text1: msg,
          });
        }
      }

      export  const downloadResource = path => {
        const fpath = path;
        const name = fpath.slice(fpath.lastIndexOf('/')).slice(1).split('?')[0];
        const finalName = name.slice(0, name.lastIndexOf('.')).split('%')[1];
        console.log(fpath, name, finalName, 'path inside DOWNLOAD RESOURCE');
        let RNFS = require('react-native-fs');
        let downloadDest;
        if (Platform.OS === 'android') {
          downloadDest = `${RNFS.ExternalStorageDirectoryPath}/Download`;
        } else {
          downloadDest = RNFS.DocumentDirectoryPath;
        }
        const tempUrl = downloadDest;
    
        const ext = fpath.slice(fpath.lastIndexOf('.')).split('?')[0];
    
        const finalUrl = `file://${tempUrl}/${finalName}${ext}`;
        console.log('temp', tempUrl);
        console.log('***', finalUrl, 'finalUrl', ext, name);
    
        const download = () => {
          try {
            console.log('download started...');
            notifyMessage('download started...');
            RNFS.downloadFile({
              fromUrl: `${path}`,
              toFile: finalUrl,
            })
              .promise.then(res => {
                console.log('res', res);
                if (res?.statusCode === 200) {
                  console.log(res, 'res here');
                  console.log('file Downloaded successfully');
                  notifyMessage('file Downloaded successfully');
                } else {
                  console.log('something went wrong');
                  notifyMessage('something went wrong');
                }
              })
              .catch(err => {
                console.log('network error', err);
                notifyMessage('network error');
              });
          } catch (err) {
            console.log('in catch', err);
          } finally {
          }
        };
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
                      download();
                    } else if (result === 'blocked') {
                      console.log(
                        'Permission Denied: Some features need external storage access. Grant permission in device settings for full functionality.',
                      );
                    }
                  });
                  console.log(
                    'The permission has not been requested / is denied but requestable',
                  );
                  break;
                case RESULTS.LIMITED:
                  console.log(
                    'The permission is limited: some actions are possible',
                  );
                  break;
                case RESULTS.GRANTED:
                  download();
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
          download();
        }
      };
    
function checkInDownloadFolder(fileName, downloadUrl, ext1, myLocal,navigation,downloadsPath){
  RNFS.readDir(downloadsPath)
  .then(result => {
    const found = result.find(file => file.name === fileName);
    if (found) {
      console.log('File exists in Downloads folder:', found.path);
      const ext = found.path.split('.');
      if (ext[1] == 'jpg' || ext[1] == 'png' || ext[1] == 'jpeg') {
        navigation.navigate('ImageShow', {vidLink: found.path});
      } else if (ext[1] == 'pdf') {
        navigation.navigate('PdfShow', {vidLink: found.path});
      } else if (ext[1] == 'mp4') {
        navigation.navigate('VideoShow', {vidLink: found.path});
      } else if (ext[1] == 'mp3') {
      } else {
        notifyMessage(
          'file should be jpg,png,jpeg,pdf,mp4,mp3 format for preview',
        );
      }
    } else {
      if (ext1 == '.jpg' || ext1 == '.png' || ext1 == '.jpeg') {
        navigation.navigate('ImageShow', {vidLink: downloadUrl});
      } else if (ext1 == '.pdf') {
        navigation.navigate('PdfShow', {vidLink: downloadUrl});
      } else if (ext1 == '.mp4') {
        navigation.navigate('VideoShow', {vidLink: downloadUrl});
      } else if (ext1 == '.mp3') {
      } else {
        notifyMessage(
          'file should be jpg,png,jpeg,pdf,mp4,mp3 format for preview',
        );
      }
      downloadResource(downloadUrl);
    }
  })
  .catch(error => {
    console.error('Error reading Downloads folder:', error);
    notifyMessage('Error reading Downloads folder');
  });
}
    export const checkFileExist=(fileName, downloadUrl, ext1, myLocal,navigation)=> {
        let downloadsPath = RNFS.DownloadDirectoryPath;
    
        if (Platform.OS === 'android') {
        } else {
          downloadsPath = RNFS.DocumentDirectoryPath;
        }
        console.log(':::::', myLocal, '///', ext1);
        if (myLocal.length > 10) {
          RNFS.exists(myLocal)
            .then(exists => {
              if (exists) {
                console.log('File exists', exists, ext1);
                if (ext1 == '.jpg' || ext1 == '.png' || ext1 == '.jpeg') {
                  navigation.navigate('ImageShow', {vidLink:  myLocal});
                } else if (ext1 == '.pdf') {
                  navigation.navigate('PdfShow', {vidLink:  myLocal});
                } else if (ext1 == '.mp4') {
                  navigation.navigate('VideoShow', {vidLink:  myLocal});
                } else if (ext1 == '.mp3') {
                } else {
                  notifyMessage(
                    'file should be jpg,png,jpeg,pdf,mp4,mp3 format for preview',
                  );
                }
              } else {
                checkInDownloadFolder(fileName, downloadUrl, ext1, myLocal,navigation,downloadsPath)
                // console.log('File does not exist');
                // if (ext1 == '.jpg' || ext1 == '.png' || ext1 == '.jpeg') {
                //   navigation.navigate('ImageShow', {vidLink: myLocal});
                // } else if (ext1 == '.pdf') {
                //   navigation.navigate('PdfShow', {vidLink: myLocal});
                // } else if (ext1 == '.mp4') {
                //   navigation.navigate('VideoShow', {vidLink: myLocal});
                // } else if (ext1 == '.mp3') {
                // } else {
                //   notifyMessage(
                //     'file should be jpg,png,jpeg,pdf,mp4,mp3 format for preview',
                //   );
                // }
                // downloadResource(downloadUrl);
              }
            })
            .catch(error => {
              console.log('llll', error);
              checkInDownloadFolder(fileName, downloadUrl, ext1, myLocal,navigation,downloadsPath)
            });
        } else {
          checkInDownloadFolder(fileName, downloadUrl, ext1, myLocal,navigation,downloadsPath)
          // RNFS.readDir(downloadsPath)
          //   .then(result => {
          //     const found = result.find(file => file.name === fileName);
          //     if (found) {
          //       console.log('File exists in Downloads folder:', found.path);
          //       const ext = found.path.split('.');
          //       if (ext[1] == 'jpg' || ext[1] == 'png' || ext[1] == 'jpeg') {
          //         navigation.navigate('ImageShow', {vidLink: found.path});
          //       } else if (ext[1] == 'pdf') {
          //         navigation.navigate('PdfShow', {vidLink: found.path});
          //       } else if (ext[1] == 'mp4') {
          //         navigation.navigate('VideoShow', {vidLink: found.path});
          //       } else if (ext[1] == 'mp3') {
          //       } else {
          //         notifyMessage(
          //           'file should be jpg,png,jpeg,pdf,mp4,mp3 format for preview',
          //         );
          //       }
          //     } else {
          //       if (ext1 == '.jpg' || ext1 == '.png' || ext1 == '.jpeg') {
          //         navigation.navigate('ImageShow', {vidLink: downloadUrl});
          //       } else if (ext1 == '.pdf') {
          //         navigation.navigate('PdfShow', {vidLink: downloadUrl});
          //       } else if (ext1 == '.mp4') {
          //         navigation.navigate('VideoShow', {vidLink: downloadUrl});
          //       } else if (ext1 == '.mp3') {
          //       } else {
          //         notifyMessage(
          //           'file should be jpg,png,jpeg,pdf,mp4,mp3 format for preview',
          //         );
          //       }
          //       downloadResource(downloadUrl);
          //     }
          //   })
          //   .catch(error => {
          //     console.error('Error reading Downloads folder:', error);
          //     notifyMessage('Error reading Downloads folder');
          //   });
        }
      }