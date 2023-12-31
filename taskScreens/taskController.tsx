import React,{FC} from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateGoal from "./taskControllerScreens/goal";
const Stack = createNativeStackNavigator();

// interface NavigationProps {
//     setOptions: Function
// }

interface Props {
    // navigation: NavigationProps
}

export default function TaskController(props:Props) {
    return (
        <Stack.Navigator initialRouteName="CreateGoal" screenOptions={{headerShown:false}}>
            <Stack.Screen name="CreateGoal" component={CreateGoal} />
        </Stack.Navigator>
    )
}