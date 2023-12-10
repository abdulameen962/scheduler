import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Home from "../taskScreens/home"
import Setting from '../taskScreens/settings';
import PropTypes from "prop-types"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import {
    MD3LightTheme as DefaultTheme,
    Provider as PaperProvider,
} from "react-native-paper";

const theme = {
...DefaultTheme,
colors: {
    ...DefaultTheme.colors,
    secondaryContainer: "transparent",
},
};
// import NotificationsView from '../taskScreens/notification';
const IconHeight = 26
const {height} = Dimensions.get('window');
const BottomStack = createMaterialBottomTabNavigator()

const HomeScreen = props => {
    const {updateState} = props;

    return(
        <PaperProvider theme={theme}>
            <BottomStack.Navigator initialRouteName="Home" 
            activeColor="black"
            // inactiveColor='green'
            shifting
            labeled={false}
            barStyle={{
                height:height * 0.09,
                backgroundColor:'rgba(255, 255, 255,.4)',
                // paddingBottom:45
                // display:"none"
            }}
            screenOptions={{
                tabBarStyle: { position: 'absolute' },
                tabBarBackground: () => (
                    <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
                  ),
            }}
            // barStyle={{display:'none'}}
            >
                <BottomStack.Screen name="Home" component={Home}
                    options={{
                        animationTypeForReplace: 'pop', 
                        tabBarActiveBackgroundColor:"white",
                        title:'Home',
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="home" color={color} size={IconHeight} />),
                          
                    }}
                />
                
                <BottomStack.Screen name="Setting" 
                options={{animationTypeForReplace: 'pop',title:'Setting',tabBarLabel: 'Setting',tabBarIcon: ({ color }) => (<Ionicons name="person-outline" color={color} size={IconHeight} />),}}
                >
                    {(props) => <Setting {...props} updateState={updateState}  />}
                </BottomStack.Screen>
                {/* <BottomStack.Screen name="Notification" component={NotificationsView} /> */}
            </BottomStack.Navigator>
        </PaperProvider>
    )

    // also add calendar to like check for tasks for that day then with a bottom sheet to create task

    // goal page too
}

HomeScreen.propTypes = {
    updateState: PropTypes.func.isRequired,
}
export default HomeScreen
