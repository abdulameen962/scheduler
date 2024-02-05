import React, {createRef} from 'react';
// import 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import {store,persistor} from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer  } from '@react-navigation/native';
import Login from './screens/login';
import Carousel from './screens/carousel';
import HomeScreen from './screens/HomeScreen';
import Signup from './screens/signup';
import ForgotPassword from './screens/forgotPassword';
import ForgotPasswordEmail from './screens/ForgotPasswordEmail';
import VerifyOtp from './screens/verifyotp';
import ForgotOtp from './screens/ForgotOtp';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import { clearMessages,setNotificationToken } from './redux/actions';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants'
import GetNav from './layouts/appLayout';
import * as Updates from 'expo-updates';
import PageLayout from './layouts/pageLayout';
import { Spinner } from "@gluestack-ui/themed";
// import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { GluestackUIProvider } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import * as Font from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black, } from "@expo-google-fonts/inter";

import registerAllTasks from "./backgroundtasks/handler";
import { schedulePushNotification } from './nativeHelpers';
import messaging from "@react-native-firebase/messaging";
import * as Clipboard from 'expo-clipboard';                  
import {Alert} from "react-native";
// import GetNav from './layouts/appLayout';

// import {LogBox} from "react-native";

// LogBox.ignoreLogs([
// "ViewPropTypes will be removed",
// "ColorPropType will be removed",
// ])

const Stack = createNativeStackNavigator();

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      // style={styles.style}
      // contentContainerStyle={styles.contentContainerStyle}
      // text1Style={styles.text1Style}
      text1NumberOfLines={1}
      // text2Style={styles.text2Style}
      text2NumberOfLines={2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      // style={[styles.style, styles.errorStyle]}
      // contentContainerStyle={styles.contentContainerStyle}
      // text1Style={styles.text1Style}
      text1NumberOfLines={1}
      // text2Style={styles.text2Style}
      text2NumberOfLines={2}
    />
  ),
};

class App extends React.Component {
  state = {
    hasCheckedCarousel:false,
    userAuth: false,
    registerDone: false,
    onboardDone: false,
    initialRouteName: "Carousel",
    token: null,
    notification: null,
    navigation: null,
  }

  setNavigation = (navigation) => {
    if (this.state.navigation !== navigation) {
      this.setState({navigation,})
    }
  }

  registerForPushNotificationsAsync = async () => {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig.extra.eas.projectId, })).data;
      // console.log(token);
    } else {
      Alert.alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }

  updateState = (link=null) => {
    const storeState = store.getState();

    try{
      if (storeState.user.onboardDone) {
          this.setState({
            userAuth: true,
            registerDone: true,
            hasCheckedCarousel: true,
            initialRouteName: link !== null ? link : this.state.initialRouteName
          })
      }

      else if (storeState.user.registerDone) {
        this.setState({
          registerDone: true,
          hasCheckedCarousel: true,
          initialRouteName: link !== null ? link : this.state.initialRouteName
        })
      }

      else if (storeState.user.carouselCheck) {
        this.setState({
          hasCheckedCarousel: true,
          userAuth: false,
          registerDone: false,
          initialRouteName: link !== null ? link : this.state.initialRouteName
        })
      }

      else{
        this.setState({
          userAuth: false,
          registerDone: false,
          hasCheckedCarousel: false,
          initialRouteName: link !== null ? link : this.state.initialRouteName
        }) 
      }
    }
    catch(error){
        
    }
  }

  sendNotification = async (header,body,extraData={ data: 'goes here' }) => {
    await schedulePushNotification(header,body,extraData);
  }

  startNotification = () => {
    const notificationListener = createRef();
    const responseListener = createRef();
    // first check whether we have token already or not
    this.registerForPushNotificationsAsync().then(token => {
      this.setState({
        token
      })
    }); 

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      this.setState({notification});
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const {url} = response.notification.request.content.data;
      if (url) {
        // redirect here
        const navigation = this.state.navigation;
        if (navigation) {
          navigation.navigate(url); 
        }
      }
      else{
        navigation.navigate(this.state.initialRouteName ? this.state.initialRouteName : "Home");
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }

  copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
  };

  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }

    return enabled;
  };

  getRealFcmToken = async () => {
    const tokenFromStorage = store.getState().user.notificationToken;
    if(await this.requestUserPermission()){
      try {
        const token = await messaging().getToken();
        // await this.copyToClipboard(token)
        if(token !== tokenFromStorage) {
          store.dispatch(setNotificationToken(token));
          Alert.alert(token);
        };
      } catch (e) {
        console.log(e);
        // Alert.alert(e)
      }
    }
  }
  
  componentDidMount() {
    store.dispatch(clearMessages());
    Toast.hide();
    this.updateState();
    this.startNotification();
    this.onFetchUpdateAsync();
    this.getRealFcmToken();
  }

  onFetchUpdateAsync = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      // alert(`Error fetching latest Expo update: ${error}`);
    }
    await registerAllTasks();
    // await unregisterBackgroundFetchAsync();
  }

  render(){
    return(
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <NavigationContainer
                fallback={<PageLayout><Spinner size="large" /></PageLayout>}
              >
                { 
                  this.state.userAuth == false ? (
                    <>
                      {
                        this.state.hasCheckedCarousel == false ? (
                          <Stack.Navigator screenOptions={{headerShown:false,animation:"fade_from_bottom"}} initialRouteName={this.state.initialRouteName}>
                              <Stack.Screen name="Carousel" >
                                {(props) => <Carousel {...props} moveToLogin={this.updateState}  />}
                              </Stack.Screen>
                          </Stack.Navigator>
                        ):(
                          <Stack.Navigator screenOptions={{headerShown:false,animation:"fade_from_bottom"}} initialRouteName={this.state.initialRouteName}>
                            {
                              this.state.registerDone == false ? (
                                <>
                                  <Stack.Screen name="Login">
                                    {(props) => <Login {...props} updateState={this.updateState} />}
                                  </Stack.Screen>

                                  <Stack.Screen name="Signup">
                                    {(props) => <Signup {...props} updateState={this.updateState} sendNotification={this.sendNotification}  />}
                                  </Stack.Screen>
                                </>
                              ):(
                                <Stack.Screen name="VerifyOtp">
                                  {(props) => <VerifyOtp {...props} updateState={this.updateState} sendNotification={this.sendNotification} />}
                                </Stack.Screen>
                              )
                            }
                            <Stack.Screen name="Forgot" component={ForgotPassword} />
                            <Stack.Screen name="ForgotOtp" component={ForgotOtp} />
                            <Stack.Screen name="ForgotPasswordEmail" component={ForgotPasswordEmail} />
                          </Stack.Navigator>

                        )
                      }
                      </>
                  ):(
                    <HomeScreen updateState={this.updateState}/>
                  )
                }
                {
                  this.state.token && this.state.notification && (
                    <GetNav setNavigation={this.setNavigation}/>
                  )
                }
              </NavigationContainer>
              <Toast config={toastConfig} />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    )
  }
}

import {
  BottomSheetModalProvider,} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';

function Main() {
  const [fontsLoaded] = Font.useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  })

  const [isOnline,changeStatus] = React.useState(true);

  React.useEffect(() => {
    handleOnline();
  },[isOnline]);

  const checkInternet = NetInfo.addEventListener(state => {
    // console.log('Connection type', state.type);
    // console.log('Is connected?', state.isConnected);
    if (isOnline !== state.isConnected) {
      changeStatus(state.isConnected);
    }
  });

  checkInternet();

  const handleOnline = () => {
    if (!isOnline) {
      // add a toast notification to inform the user
      Toast.show({
        type: `error`,
        text1:"Internet connection",
        text2: "You are currently offline and some functions might not work",
        position:"top",
        bottomOffset: 30,
        visibilityTime: 6000,
        // visibilityTime: 7000
        // topOffset: 30,
      })
    }
  }
  
  return (
      <GluestackUIProvider config={config}>
          <App/>
        </GluestackUIProvider>
      
  );
}

export default Main;