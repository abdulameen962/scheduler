import React from "react"
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
// import { makeRedirectUri } from "expo-auth-session"
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {EXPO_PUBLIC_GOOGLE_ANDROID_AUTH,EXPO_PUBLIC_GOOGLE_ISO_AUTH,EXPO_PUBLIC_GOOGLE_WEB_AUTH} from "@env"
import {TouchableOpacity,Text,View,Image} from "react-native"
import styles from "../styles";
import { googleApi } from "../redux/actions"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import Toast from "react-native-toast-message"
import { store } from "../redux/store"
// console.log(EXPO_PUBLIC_GOOGLE_ANDROID_AUTH)
// import * as Linking from 'expo-linking';
// import { A } from '@expo/html-elements';

// Linking.openURL('https://expo.dev');

WebBrowser.maybeCompleteAuthSession();

const GoogleComponent = props => {
    const GOOGLE_ANDROID_AUTH = EXPO_PUBLIC_GOOGLE_ANDROID_AUTH;
    const GOOGLE_ISO_AUTH = EXPO_PUBLIC_GOOGLE_ISO_AUTH;
    // const [userInfo,setUserInfo] = React.useState(null)
    const [request,response,promptAsync] = Google.useAuthRequest({
        androidClientId: `${GOOGLE_ANDROID_AUTH}`,
        iosClientId: `${GOOGLE_ISO_AUTH}`,
        webClientId: `${EXPO_PUBLIC_GOOGLE_WEB_AUTH}`,
        expoClientId:`${EXPO_PUBLIC_GOOGLE_WEB_AUTH}`,
        // redirectUri: makeRedirectUri({
        //     native: "com.abdulameen.schedulermobile",
        //     useProxy: false,
        // }),
        scopes: ["profile","email"]
    })
    
    React.useEffect(() => {
        handleSigninWithGoogle();
    },[response])

    async function handleSigninWithGoogle() {
        if (response?.type === "success") {
            await getUserInfo(response.authentication.accessToken);
        }
    }

    const getUserInfo = async token => {
        if(!token) return;
        Toast.show({
            type:"success",
            text1:`${props.name} underway`,
            text2: "Thanks for connecting your account,you will be logged in shortly",
            position:"top",
            // visibilityTime: 7000
            // topOffset: 30,
        })
        const result = await props.googleApi(token,store);
        if (result && props.sendNotification) {
            let header = "Thanks for signing up";
            let body = "Congrats on signing up,awesome awaits 🙌🎉🙌🎉";
            props.sendNotification(header,body,{url:"Setting"});
        }
    }

    return (
        <View>
            {/* <A href="https://google.com">Go to Google</A> */}
            <TouchableOpacity onPress={() => promptAsync()} style={[styles.googleBtn,{flexDirection:"row"}]}>
                <Image source={require("../assets/google.png")}
                    resizeMode="contain"
                    style={styles.googleImg}
                />
                <Text style={[styles.googleText]}>{props.name?props.name:"Login"} with Google</Text>
            </TouchableOpacity>
        </View>
    )
}

GoogleComponent.propTypes = {
    name: PropTypes.string.isRequired,
    sendNotification: PropTypes.func,
}

const mapStateToProps = (state,ownProps) => ({
    name: ownProps.name,
    sendNotification: ownProps.sendNotification,
})


export default connect(mapStateToProps,{googleApi})(GoogleComponent)