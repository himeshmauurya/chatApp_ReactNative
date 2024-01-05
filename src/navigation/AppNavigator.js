
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from '../screens/Splash';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
import Main from '../screens/Main';
import Chat from '../screens/Chat';
import VideoShow from '../screens/VideoShow';
import ImageShow from '../screens/ImageShow';
import PdfShow from '../screens/PdfShow';
import AudioShow from '../screens/AudioShow';
const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}}/>
      <Stack.Screen name="Signup" component={Signup} options={{headerShown:false}}/>
      <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
      <Stack.Screen name="Main" component={Main} options={{headerShown:false}}/>
      <Stack.Screen name="Chat" component={Chat} options={{headerShown:true}}/>
      <Stack.Screen name="VideoShow" component={VideoShow} options={{headerShown:true}}/>
      <Stack.Screen name="ImageShow" component={ImageShow} options={{headerShown:true}}/>
      <Stack.Screen name="PdfShow" component={PdfShow} options={{headerShown:true}}/>
      <Stack.Screen name="AudioShow" component={AudioShow} options={{headerShown:true}}/>
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default AppNavigator