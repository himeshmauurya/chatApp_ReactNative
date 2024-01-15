
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from '../screens/splash/Splash';
import Signup from '../screens/authentication/Signup';
import Login from '../screens/authentication/Login';
import Main from '../screens/splash/Main';
import Chat from '../screens/chat/Chat';
import VideoShow from '../screens/views/VideoShow';
import ImageShow from '../screens/views/ImageShow';
import PdfShow from '../screens/views/PdfShow';
import AudioShow from '../screens/views/AudioShow';
import Setting from '../tabs/Setting';
import Users from '../tabs/Users';
const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}}/>
      <Stack.Screen name="Signup" component={Signup} options={{headerShown:false}}/>
      <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
      <Stack.Screen name="Main" component={Main} options={{headerShown:false}}/>
      <Stack.Screen name="Chat" component={Chat} options={{headerShown:false}}/>
      <Stack.Screen name="VideoShow" component={VideoShow} options={{headerShown:false}}/>
      <Stack.Screen name="ImageShow" component={ImageShow} options={{headerShown:false}}/>
      <Stack.Screen name="PdfShow" component={PdfShow} options={{headerShown:false}}/>
      <Stack.Screen name="AudioShow" component={AudioShow} options={{headerShown:true}}/>
      <Stack.Screen name="Setting" component={Setting} options={{headerShown:true}}/>
      <Stack.Screen name="Users" component={Users} options={{headerShown:true}}/>
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default AppNavigator