import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Home from "../taskScreens/home"
import Setting from '../taskScreens/settings';
import PropTypes from "prop-types"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import NotificationsView from '../taskScreens/notification';

const BottomStack = createMaterialBottomTabNavigator()

const HomeScreen = props => {
    const {updateState} = props;

    return(
        <BottomStack.Navigator initialRouteName="Home" 
        activeColor="black"
        // barStyle={{display:'none'}}
        >
            <BottomStack.Screen name="Home" component={Home}
            options={{animationTypeForReplace: 'pop',title:'Home',tabBarLabel: 'Home',tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="home" color={color} size={26} />),}}
            
            />
            <BottomStack.Screen name="Setting" 
             options={{animationTypeForReplace: 'pop',title:'Setting',tabBarLabel: 'Setting',tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="pinwheel" color={color} size={26} />),}}
            >
                {(props) => <Setting {...props} updateState={updateState}  />}
            </BottomStack.Screen>
            {/* <BottomStack.Screen name="Notification" component={NotificationsView} /> */}
        </BottomStack.Navigator>
    )
}

HomeScreen.propTypes = {
    updateState: PropTypes.func.isRequired,
}
export default HomeScreen
