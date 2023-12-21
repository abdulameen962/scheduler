import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "../taskScreens/home"
import Setting from '../taskScreens/settings';
import PropTypes from "prop-types"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from "react-native-vector-icons/AntDesign"
import { Dimensions } from 'react-native';
import CustomPlusButton from '../components/plusButton'
import { BlurView } from 'expo-blur';
import {
    MD3LightTheme as DefaultTheme,
    Provider as PaperProvider,
} from "react-native-paper";

import AddTask from '../taskScreens/addTask';

import { StyleSheet } from 'react-native';

const theme = {
...DefaultTheme,
colors: {
    ...DefaultTheme.colors,
    secondaryContainer: "transparent",
},
};
// import NotificationsView from '../taskScreens/notification';
const IconHeight = 24
const {height,width} = Dimensions.get('window');
const BottomStack = createBottomTabNavigator()

const HomeScreen = props => {
    const {updateState} = props;

    return(
        <PaperProvider theme={theme}>
            <BottomStack.Navigator 
                initialRouteName="Home" 
                activeColor="black"
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: { 
                        backgroundColor:'white',
                        // backgroundColor:'green',
                        position: 'absolute',
                        bottom: 0,
                        height: 60,
                        width:width,
                        // borderRadius: 40,
                        elevation: 0,
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                        borderLeftWidth: 0.2,
                        borderRightWidth: 0.2,
                        overflow: 'hidden',
                    },
                    tabBarBackground: () => (
                        <BlurView tint="light" intensity={0} style={StyleSheet.absoluteFill} />
                    ),
                }}
            >
                <BottomStack.Screen name="Home" component={Home}
                    options={{
                        animationTypeForReplace: 'pop', 
                        // tabBarActiveBackgroundColor:"white",
                        title:'Home',
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="home" color={color} size={IconHeight} />),
                        
                    }}
                />
                <BottomStack.Screen
                    name='Add Task'
                    options={{
                        animationTypeForReplace: 'pop', 
                        // tabBarActiveBackgroundColor:"white",
                        title:'Add Task',
                        tabBarLabel: 'Add Task',
                        tabBarIcon: ({ color,focused }) => (<AntDesign name="plus" color={'white'} size={IconHeight * 1} />),
                        tabBarButton: (props) => (
                            <CustomPlusButton {...props} />
                        )
                    }}
                    listeners={({navigation}) => ({
                        tabPress: (e) => {
                            // Prevent default action
                            e.preventDefault();
                            const {history} = navigation.getState();
                            const {key} = history[0];
                            const previousState = key.split('-')[0]
                            console.log(previousState); 
                            // Do something with the `navigation` object
                            
                          
                        },
                      })}
                >
                    {(props) => <Setting {...props} updateState={updateState}  />}
                </BottomStack.Screen>
                <BottomStack.Screen name="Setting" 
                    options={{
                        animationTypeForReplace: 'pop',
                        // tabBarActiveBackgroundColor:"white",
                        title:'Setting',
                        tabBarLabel: 'Setting',
                        tabBarIcon: ({ color }) => (<Ionicons name="person-outline" color={color} size={IconHeight} />),
                    }}
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
