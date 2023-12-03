import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Home from "../taskScreens/home"
import Setting from '../taskScreens/settings';
import PropTypes from "prop-types"

const BottomStack = createMaterialBottomTabNavigator()

const HomeScreen = props => {
    const {updateState} = props;

    return(
        <BottomStack.Navigator initialRouteName="Home">
            <BottomStack.Screen name="Home" component={Home}/>
            <BottomStack.Screen name="Logout">
                {(props) => <Setting {...props} updateState={updateState}  />}
            </BottomStack.Screen>
        </BottomStack.Navigator>
    )
}

HomeScreen.propTypes = {
    updateState: PropTypes.func.isRequired,
}
export default HomeScreen
