import React, {createRef} from 'react';
// import 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import {store,persistor} from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import Login from './screens/login';
import Carousel from './screens/carousel';
import HomeScreen from './screens/HomeScreen';
import Signup from './screens/signup';
import ForgotPassword from './screens/forgotPassword';
import ForgotPasswordEmail from './screens/ForgotPasswordEmail';
import VerifyOtp from './screens/verifyotp';
import ForgotOtp from './screens/ForgotOtp';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import { clearMessages } from './redux/actions';


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

export default class App extends React.Component {
  state = {
    hasCheckedCarousel:false,
    userAuth: false,
    registerDone: false,
    onboardDone: false,
    initialRouteName: "Carousel"
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
          initialRouteName: link !== null ? link : this.state.initialRouteName
        })
      }
    }
    catch(error){
        
    }
  }

  componentDidMount() {
    store.dispatch(clearMessages());
    Toast.hide();
    this.updateState();
  }

  render(){
    return(
      <>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
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
                                  {(props) => <Signup {...props} updateState={this.updateState}  />}
                                </Stack.Screen>
                              </>
                            ):(
                              <Stack.Screen name="VerifyOtp">
                                {(props) => <VerifyOtp {...props} updateState={this.updateState}  />}
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
                  <HomeScreen/>
                )
              }
            </NavigationContainer>
          </PersistGate>
        </Provider>
        <Toast config={toastConfig} />
      </>
    )
  }
}
