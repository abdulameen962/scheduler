import React from "react"
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import {EXPO_PUBLIC_GOOGLE_ANDROID_AUTH,EXPO_PUBLIC_GOOGLE_ISO_AUTH} from "@env"
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity,Text,View,Image} from "react-native"
import styles from "../styles";
import { store } from "../redux/store"
import { googleDetails } from "../redux/actions"
// console.log(EXPO_PUBLIC_GOOGLE_ANDROID_AUTH)
// import * as Linking from 'expo-linking';
// import { A } from '@expo/html-elements';

// Linking.openURL('https://expo.dev');

WebBrowser.maybeCompleteAuthSession();

const GoogleComponent = props => {
    const GOOGLE_ANDROID_AUTH = EXPO_PUBLIC_GOOGLE_ANDROID_AUTH;
    const GOOGLE_ISO_AUTH = EXPO_PUBLIC_GOOGLE_ISO_AUTH;
    const [userInfo,setUserInfo] = React.useState(null)
    const [request,response,promptAsync] = Google.useAuthRequest({
        androidClientId: `${GOOGLE_ANDROID_AUTH}`,
        iosClientId: `${GOOGLE_ISO_AUTH}`,
    })
    
    React.useEffect(() => {
        handleSigninWithGoogle();
    },[response])

    async function handleSigninWithGoogle() {
        const {userDetails} = store.getState().user;
        if (!userDetails) {
            if (response?.type === "success") {
                await getUserInfo(response.authentication.accessToken);
            }
        }
        else {
            setUserInfo(JSON.parse(userDetails));
        }
    }

    const getUserInfo = async token => {
        if(!token) return;
        try{
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const user = await response.json();
            store.dispatch(googleDetails(user));
            setUserInfo(user);
        }
        catch(error) {
            //Add custom error here
        }
    }

    return (
        <View>
            <Text>{JSON.stringify(userInfo,null,2)}</Text>
            {/* <A href="https://google.com">Go to Google</A> */}
            <TouchableOpacity onPress={() => promptAsync()} style={[styles.googleBtn,{flexDirection:"row"}]}>
                <Image source={require("../assets/google.png")}
                    resizeMode="contain"
                    style={styles.googleImg}
                />
                <Text style={[styles.googleText]}>Sign in with Google</Text>
            </TouchableOpacity>
        </View>
    )
}


export default GoogleComponent