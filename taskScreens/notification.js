import React,{createRef, useRef} from 'react'
import { View,Text,Button,Alert } from 'react-native'
// import messaging from '@react-native-firebase/messaging'

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
});

class NotificationsView extends React.Component{

    // requestUserPermission = async () => {
    //     const authStatus = await messaging().requestPermission();
    //     const enabled =
    //         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //         authStatus === messaging.AuthorizationStatus.PROVISIONAL

    //     if (enabled) {
    //         console.log('Authorization',authStatus)
    //     }
    // }
    state = {
      token: '',
      notification: ''
    }

    schedulePushNotification = async() => {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' },
          },
          trigger: { seconds: 2 },
        });
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
          console.log(token);
        } else {
          Alert.alert('Must use physical device for Push Notifications');
        }
      
        return token;
    }

    // componentDidMount = () => {
    //     if (this.requestUserPermission()) {
    //         messaging().getToken().then(token => {
    //             console.log(token);
    //         })
    //     }
    //     else{
    //         throw new Error('Permission not given');
    //     }

    //     messaging()
    //         .getInitialNotification()
    //         .then(async remoteMessage => {
    //             console.log("Notification caused app to open from quit state",remoteMessage);
    //     })

    //     messaging().onNotificationOpenedApp(async (remoteMessage) => {
    //         console.log('Notification caused app to open from background state',remoteMessage.notification);
    //     })

    //     messaging().setBackgroundMessageHandler(async remoteMessage => {
    //         console.log("Message handled in the background",remoteMessage);
    //     })

    //     const unsubscribe = messaging().onMessage(async remoteMessage => {
    //         Alert.alert('A new FCM message arrived',JSON.stringify(remoteMessage));
    //     })

    //     return unsubscribe;

    // }
    componentDidMount = () => {
      const notificationListener = createRef();
      const responseListener = createRef();
      this.registerForPushNotificationsAsync().then(token => this.setState({
        token
      }));

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        this.setState({notification});
      });
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }

    render(){
        return (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Text>Your expo push token: {this.state.token}</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text>Title: {this.state.notification && this.state.notification.request.content.title} </Text>
              <Text>Body: {this.state.notification && this.state.notification.request.content.body}</Text>
              <Text>Data: {this.state.notification && JSON.stringify(this.state.notification.request.content.data)}</Text>
            </View>
            <Button
              title="Press to schedule a notification"
              onPress={async () => {
                await this.schedulePushNotification();
              }}
            />
          </View>
        )
    }
}

export default NotificationsView