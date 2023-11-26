import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Home from '../components/home'

const BottomStack = createMaterialBottomTabNavigator()

const HomeScreen = () => {
    return(
        <BottomStack.Navigator initialRouteName="Home">
            <BottomStack.Screen name="Home" component={Home}/>
        </BottomStack.Navigator>
    )
}

export default HomeScreen
