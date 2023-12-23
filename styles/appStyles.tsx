import { StyleSheet } from "react-native";
import Constants from 'expo-constants';

// const lightPurple = "rgba(219, 212, 254,.2)";
const appStyles = StyleSheet.create({
    taskLeft:{
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 25,
        height: "100%",
        justifyContent: "space-between",
        // borderColor: "green",
        // borderStyle: "solid",
        // borderWidth: 1,
    },
    taskLeftContainer:{
        paddingRight: 0,
    },
    taskRightContainer:{
        paddingLeft: 15,
    },
    taskRight:{
        marginTop: 10,
        paddingVertical:18,
        paddingHorizontal: 20,
        borderRadius: 15,
    },
    tinyImg:{
        width: 40,
        height: 40,
        maxWidth: "100%",
    },
    shadowProp:{  
        shadowOffset:{width:0, height:3},  
        shadowColor:'#171717',  
        shadowOpacity:0.4,  
        shadowRadius:5,  
    },  
});

export default appStyles