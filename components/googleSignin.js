import React from "react"
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import { makeRedirectUri } from "expo-auth-session"
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {EXPO_PUBLIC_GOOGLE_ANDROID_AUTH,EXPO_PUBLIC_GOOGLE_ISO_AUTH,EXPO_PUBLIC_GOOGLE_WEB_AUTH} from "@env"
import {TouchableOpacity,Text,View,Image} from "react-native"
import styles from "../styles";
import { store } from "../redux/store"
import { googleApi } from "../redux/actions"
import { connect } from "react-redux"
import PropTypes from "prop-types"
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
        webClientId: `${EXPO_PUBLIC_GOOGLE_WEB_AUTH}`,
        expoClientId:`${EXPO_PUBLIC_GOOGLE_WEB_AUTH}`,
        redirectUri: makeRedirectUri({
            native: "com.abdulameen.schedulerMobile://oauthredirect",
            useProxy: false,
        }),
        scopes: ["profile","email"]
    })
    
    React.useEffect(() => {
        handleSigninWithGoogle();
    },[response])

    async function handleSigninWithGoogle() {
        const {userDetails} = store.getState().user;
        if (!userDetails) {
            // console.log(response)
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
        await props.googleApi(token);
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
    name: PropTypes.string.isRequired
}

const mapStateToProps = (state,ownProps) => ({
    name: ownProps.name,
})


export default connect(mapStateToProps,{googleApi})(GoogleComponent)