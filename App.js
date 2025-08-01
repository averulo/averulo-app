import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './screens/LoginScreen'
import OtpScreen from './screens/OtpScreen'
import SignUpScreen from './screens/SignUpScreen'
import SplashScreen from './screens/SplashScreen'
import TakePhotoOfIDScreen from './screens/TakePhotoOfIDScreen'
import UserVerificationScreen from './screens/UserVerificationScreen'
import WelcomeScreen from './screens/WelcomeScreen'


const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="UserVerification" component={UserVerificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TakePhotoOfID" component={TakePhotoOfIDScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}