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
  AlertIOS,
} from 'react-native';
import React, {useState, useCallback, useEffect, useRef} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import * as DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import VidPreview from './VidPreview';
import AudioShow from './AudioShow';
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isAttachImage, setIsAttachImage] = useState(false);
  const [isAttachFile, setIsAttachFile] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [filePath, setFilePath] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const [mytext, setMytext] = useState('');
  const route = useRoute();

  function notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(msg);
    }
  }

  useEffect(fetchData, []);

  useEffect(() => {
    console.log('isAttachImage', isAttachImage);
    console.log('isAttachFile', isAttachFile);
    console.log('imagePath', imagePath);
    console.log('filePath', filePath);
  }, [isAttachImage, isAttachFile, imagePath, filePath]);
  useEffect(() => {
    if (filePath.length > 10) {
      uploadFileToFirebase();
    } else if (imagePath.length > 10) {
      uploadFileToFirebase();
    }
  }, [filePath, imagePath]);
  async function fetchData() {
    const subscriber = await firestore()
      .collection('chats')
      .doc('' + route.params.id + route.params.data.userId)
      .collection('messages')
      .orderBy('createdAt', 'asc');

    const unsubscribe = subscriber.onSnapshot(querysnapshot => {
      const allmessages = querysnapshot.docs.map(item => {
        return {...item._data};
      });

      setMessages(allmessages);
    });

    return () => unsubscribe();
  }
  const onSend = async () => {
    const myMsg = {
      sendBy: route.params.id,
      sendTo: route.params.data.userId,
      createdAt: new Date().getTime(),
      text: mytext,
      downloadUrl: '',
      fileName: '',
      user: {_id: route.params.id},
    };

    await firestore()
      .collection('chats')
      .doc('' + route.params.id + route.params.data.userId)
      .collection('messages')
      .add(myMsg);
    await firestore()
      .collection('chats')
      .doc('' + route.params.data.userId + route.params.id)
      .collection('messages')
      .add(myMsg);
    fetchData();
    setMytext('');
    setIsAttachImage(false);
    setIsAttachFile(false);
    setImagePath('');
    setFilePath('');
  };

  const _pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'documentDirectory',
        mode: 'import',
        allowMultiSelection: true,
      });
      const fileUri = result[0].fileCopyUri;
      if (!fileUri) {
        console.log('File URI is undefined or null');
        return;
      }
      if (fileUri.indexOf('.png') !== -1 || fileUri.indexOf('.jpg') !== -1) {
        setImagePath(fileUri);
        setIsAttachImage(true);
      } else {
        setFilePath(fileUri);
        setIsAttachFile(true);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.log('DocumentPicker err => ', err);
        throw err;
      }
    }
  };
  const uploadFileToFirebase = async () => {
    let fileUri = '';
    if (filePath.length > 10) {
      fileUri = filePath;
    } else if (imagePath.length > 10) {
      fileUri = imagePath;
    }
    notifyMessage('uploading started..');
    setShowModal(true);
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const ext = fileUri.slice(fileUri.lastIndexOf('.')).split('?')[0];
      console.log('ext ext', ext);
      let reference = storage().ref(`files/${Date.now()}${ext}`);

      await reference.put(blob);
      console.log('File uploaded to Firebase Storage!');

      const downloadUrl = await reference.getDownloadURL();
      saveFileReferenceToFirestore(downloadUrl);
    } catch (error) {
      console.error('Error uploading file to Firebase:', error);
    }
  };

  const saveFileReferenceToFirestore = async downloadUrl => {
    try {
      const name = downloadUrl
        .slice(downloadUrl.lastIndexOf('/'))
        .slice(1)
        .split('?')[0];
      const fileName1 = name.slice(0, name.lastIndexOf('.')).split('%')[1];
      const ext = downloadUrl.slice(downloadUrl.lastIndexOf('.')).split('?')[0];
      const myMsg = {
        sendBy: route.params.id,
        sendTo: route.params.data.userId,
        createdAt: new Date().getTime(),
        text: '',
        downloadUrl,
        fileName: `${fileName1}${ext}`,
        user: {_id: route.params.id},
      };

      await firestore()
        .collection('chats')
        .doc('' + route.params.id + route.params.data.userId)
        .collection('messages')
        .add(myMsg);
      await firestore()
        .collection('chats')
        .doc('' + route.params.data.userId + route.params.id)
        .collection('messages')
        .add(myMsg);
      await fetchData();

      setIsAttachImage(false);
      setIsAttachFile(false);
      setImagePath('');
      setFilePath('');
      console.log('File reference saved to Firestore!');
      notifyMessage('uploading completed');
      setShowModal(false);
    } catch (error) {
      console.error('Error saving file reference to Firestore:', error);
      notifyMessage('Error saving file reference to Firestore:');
    }
  };

  const downloadResource = path => {
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

  function checkFileExist(fileName, downloadUrl, ext1) {
    const downloadsPath = RNFS.DownloadDirectoryPath;
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
            // navigation.navigate('AudioShow', {vidLink: found.path});
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
            // navigation.navigate('AudioShow', {vidLink: downloadUrl});
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
  return (
    <View style={styles.container}>
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={showModal}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        <View style={styles.modal}>
          <Text style={styles.text}>Uploading...</Text>
          <ActivityIndicator size="large" color="white" />
        </View>
      </Modal>
      <FlatList
        inverted
        contentContainerStyle={{flexDirection: 'column-reverse'}}
        style={styles.chatContainer}
        data={messages}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          const ext = item.downloadUrl
            .slice(item.downloadUrl.lastIndexOf('.'))
            .split('?')[0];
          let videofind = '';
         
          return (
            <View
              style={[
                styles.messageBubble,
                route.params.id === item.sendBy
                  ? styles.sentBubble
                  : styles.receivedBubble,
              ]}>
              {item.downloadUrl.length > 10 ? (
                <View>
                  {ext === '.jpg' || ext === '.png' || ext === '.jpeg' ? (
                    <TouchableOpacity
                      onPress={() => {
                        checkFileExist(item.fileName, item.downloadUrl, ext);
                      }}>
                      <Image
                        source={{uri: item.downloadUrl}}
                        style={{height: 200, width: 200}}
                      />
                    </TouchableOpacity>
                  ) : ext == '.pdf' ? (
                    <TouchableOpacity
                      onPress={() => {
                        checkFileExist(item.fileName, item.downloadUrl, ext);
                      }}>
                      <Image
                        source={require('../assets/pdf.png')}
                        style={{height: 50, width: 50}}
                      />
                      <Text style={{color: 'black'}}>{item.fileName}</Text>
                    </TouchableOpacity>
                  ) : ext === '.mp4' ? (
                    
                    <TouchableOpacity
                      onPress={() => {
                        checkFileExist(item.fileName, item.downloadUrl, ext);
                      }}>
                      <VidPreview
                        value={item.downloadUrl}
                        fileName={item.fileName}
                        videofind={videofind}
                      />
                    </TouchableOpacity>
                  ) : ext == '.mp3' ? (
                    <View style={{}}>
                    <Text style={{color:'black'}}>{item.fileName}</Text>
                    <AudioShow
                      downloadUrl={item.downloadUrl}
                      fileName={item.fileName}
                      ext1={ext}
                      downloadResource1={downloadResource}
                    />
                    </View>
                  ) : null}

                </View>
              ) : (
                <Text style={styles.messageText}>{item.text}</Text>
              )}
            </View>
          );
        }}
      />
      <View style={styles.chatFooter}>
        <TextInput
          placeholder="Type a message..."
          style={styles.input}
          value={mytext}
          onChangeText={txt => {
            setMytext(txt);
          }}
        />
        <TouchableOpacity style={styles.buttonFooterChat} onPress={onSend}>
          <Text style={styles.textFooterChat}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonFooterChat}
          onPress={_pickDocument}>
          <Text style={styles.textFooterChat}>file</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  userIcon: {
    height: 40,
    width: 40,
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
    backgroundColor: '#DCF8C6',
  },
  receivedBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  messageText: {
    color: 'black',
  },
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
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
