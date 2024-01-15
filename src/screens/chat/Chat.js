import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import * as DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import {
  notifyMessage,
  downloadResource,
  checkFileExist,
} from '../../components/utils/ChatController';
import {styles} from './ChatStyle';
import List from './List';
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

  useEffect(() => {
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
    fetchData();
  }, []);
  useEffect(() => {
    if (filePath.length > 10) {
      uploadFileToFirebase();
    } else if (imagePath.length > 10) {
      uploadFileToFirebase();
    }
  }, [filePath, imagePath]);

  const onSend = async () => {
    if (mytext.length <= 0) {
      console.log('enter word');
      return;
    }
    let myMsg = {
      sendBy: route.params.id,
      sendTo: route.params.data.userId,
      createdAt: new Date().getTime(),
      text: mytext,
      downloadUrl: '',
      fileName: '',
      ext: '',
      local: '',
      user: {_id: route.params.id},
    };
    setMytext('');
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
    await fetchData1();
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
        // allowMultiSelection: true,
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
    const ext = fileUri.slice(fileUri.lastIndexOf('.')).split('?')[0];
    console.log('local ext firebase wala', ext);
    notifyMessage('uploading started..');
    setShowModal(true);
    console.log(ext, fileUri, '%%%%');
    const myMsg1 = {
      sendBy: route.params.id,
      sendTo: route.params.data.userId,
      createdAt: new Date().getTime(),
      text: '',
      downloadUrl: '',
      fileName: '',
      ext: ext,
      local: fileUri,
      user: {_id: route.params.id},
    };
    console.log('myMsg1', myMsg1);
    let docId = '';
    await firestore()
      .collection('chats')
      .doc('' + route.params.id + route.params.data.userId)
      .collection('messages')
      .add(myMsg1)
      .then(documentRef => {
        docId = documentRef.id;
        console.log('Document ID:', documentRef.id, docId);
      });
    console.log('docId:****', docId);
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const ext = fileUri.slice(fileUri.lastIndexOf('.')).split('?')[0];
      console.log('ext ext', ext);
      let reference = storage().ref(`files/${Date.now()}${ext}`);
      await reference.put(blob);
      const downloadUrl = await reference.getDownloadURL();
      saveFileReferenceToFirestore(downloadUrl, myMsg1, docId);
    } catch (error) {
      console.error('Error uploading file to Firebase:', error);
    }
  };
  async function fetchData1() {
    const subscriber = await firestore()
      .collection('chats')
      .doc('' + route.params.id + route.params.data.userId)
      .collection('messages')
      .orderBy('createdAt', 'asc');
    subscriber.onSnapshot(querysnapshot => {
      const allmessages = querysnapshot.docs.map(item => {
        return {...item._data};
      });
      setMessages(allmessages);
    });
  }
  const saveFileReferenceToFirestore = async (downloadUrl, myMsg1, docId) => {
    try {
      const name = downloadUrl
        .slice(downloadUrl.lastIndexOf('/'))
        .slice(1)
        .split('?')[0];
      const fileName1 = name.slice(0, name.lastIndexOf('.')).split('%')[1];
      const ext = downloadUrl.slice(downloadUrl.lastIndexOf('.')).split('?')[0];
      myMsg1.downloadUrl = downloadUrl;
      myMsg1.fileName = `${fileName1}${ext}`;
      console.log('myMsg1 updated', myMsg1);
      const myMsg2 = {
        sendBy: route.params.id,
        sendTo: route.params.data.userId,
        createdAt: myMsg1.createdAt,
        text: '',
        downloadUrl,
        fileName: `${fileName1}${ext}`,
        //fileName: myMsg1.fileName,
        ext: myMsg1.ext,
        local: '',
        user: {_id: route.params.id},
      };
      console.log('myMsg2', myMsg2);
      await firestore()
        .collection('chats')
        .doc('' + route.params.id + route.params.data.userId)
        .collection('messages')
        .doc(docId)
        .update(myMsg1);
      await firestore()
        .collection('chats')
        .doc('' + route.params.data.userId + route.params.id)
        .collection('messages')
        .add(myMsg2);
      await fetchData1();

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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.headerbox}>
          <Image
            source={require('../../images/back-1.png')}
            style={styles.headerImg}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        inverted
        contentContainerStyle={styles.revrow}
        style={styles.chatContainer}
        data={messages}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return <List item={item} route={route} showModal={showModal} />;
        }}
      />
      <View style={styles.chatFooter}>
        <TouchableOpacity
          style={styles.buttonFooterChat1}
          onPress={_pickDocument}>
          <Image
            source={require('../../images/clip.png')}
            style={styles.clipImg}
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Type a message..."
          style={styles.input}
          multiline={true}
          value={mytext}
          onChangeText={txt => {
            setMytext(txt);
          }}
        />
        <TouchableOpacity style={styles.buttonFooterChat} onPress={onSend}>
          <Text style={styles.textFooterChat}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Chat;
