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
  import VidPreview from '../views/VidPreview';
  import AudioShow from '../views/AudioShow';
import Toast from 'react-native-toast-message';
import Imgview from '../views/Imgview';
import {notifyMessage,downloadResource,checkFileExist } from '../../components/utils/ChatController';
import { styles } from './ChatStyle';

const List = (props) => {
    const item=props.item
    const route=props.route
    const showModal=props.showModal
    const navigation=useNavigation()
    // console.log("dsfdsfs555df")
    // console.log("----------",item,'----------',route,"----------")
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
              checkFileExist(
                item.fileName,
                item.downloadUrl,
                item.ext,
                item.local,
                navigation
              );
            }}>
            {/* <Imgview val={item.downloadUrl} /> */}
            <Image
              source={{uri: item.downloadUrl}}
              style={styles.loadImgSize}
            />
          </TouchableOpacity>
        ) : ext == '.pdf' ? (
          <TouchableOpacity
            onPress={() => {
              checkFileExist(
                item.fileName,
                item.downloadUrl,
                item.ext,
                item.local,
                navigation
              );
            }}>
            <Image
              source={require('../../assets/pdf.png')}
              style={styles.pdfImg}
            />
            <Text style={styles.pdftext}>{item.fileName}</Text>
          </TouchableOpacity>
        ) : ext === '.mp4' ? (
          <TouchableOpacity
            onPress={() => {
              checkFileExist(
                item.fileName,
                item.downloadUrl,
                item.ext,
                item.local,
                navigation
              );
            }}>
            <VidPreview
              value={item.downloadUrl}
              fileName={item.fileName}
              videofind={videofind}
            />
          </TouchableOpacity>
        ) : ext == '.mp3' ? (
          <View style={{}}>
            <Text style={styles.pdftext}>{item.fileName}</Text>
            <AudioShow
              downloadUrl={item.downloadUrl}
              fileName={item.fileName}
              ext1={ext}
              downloadResource1={downloadResource}
            />
          </View>
        ) : null}
      </View>
    ) : item.ext != '' && showModal ? (
      <View>
        {item.ext === '.jpg' ||
        item.ext === '.png' ||
        item.ext === '.jpeg' ? (
          <TouchableOpacity
          // onPress={() => {
          //   checkFileExist(item.fileName, item.downloadUrl, ext);
          // }}
          >
            {/* <Imgview val={item.downloadUrl} /> */}
            <Image
              source={{uri: item.local}}
              style={styles.loadImgSize}
            />
            <View style={styles.loadCont}>
              <ActivityIndicator size="large" />
            </View>
          </TouchableOpacity>
        ) : item.ext == '.pdf' ? (
          <TouchableOpacity
            onPress={() => {
              checkFileExist(item.fileName, item.downloadUrl, ext,navigation);
            }}>
            <View style={styles.rowItem}>
              <Image
                source={require('../../assets/pdf.png')}
                style={styles.loadpdf}
              />
              <ActivityIndicator size="large" />
            </View>
            <Text style={styles.pdftext}>{item.fileName}</Text>
          </TouchableOpacity>
        ) : item.ext === '.mp4' ? (
          <TouchableOpacity
            onPress={() => {
              checkFileExist(item.fileName, item.downloadUrl, ext,navigation);
            }}>
            <VidPreview
              value={item.local}
              fileName={item.fileName}
              videofind={videofind}
            />
            <View>
              <View style={styles.loadwidth}>
                <ActivityIndicator size="large" />
              </View>
            </View>
          </TouchableOpacity>
        ) : item.ext == '.mp3' ? (
          <View style={{}}>
            <Text style={styles.pdftext}>{item.fileName}</Text>
            <AudioShow
              downloadUrl={item.local}
              fileName={item.fileName}
              ext1={ext}
              downloadResource1={downloadResource}
            />
            <View>
              <View style={styles.loadwidth}>
                <ActivityIndicator size="large" />
              </View>
            </View>
          </View>
        ) : null}
      </View>
    ) : (
      <Text style={styles.messageText}>{item.text}</Text>
    )}
  </View>
  )
}

export default List