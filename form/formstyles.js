import { StyleSheet } from "react-native";
import Constants from 'expo-constants';

const btnColor = "#3E4ADE";
const greyBackground = "#F4F6F8";
const styles = StyleSheet.create({
    formContainer:{
        width: "100%",
        // borderWidth: 2,
        // borderStyle: "solid",
        // borderColor: greyBackground,
        marginTop: 15
    },
    inputIcon:{
        // width: 20,
        maxWidth: 25,
        maxHeight:25,
        // height: 20,
        // borderWidth: 2,
        // borderStyle: "solid",
        // borderColor: "green",
    },
    inputContainer:{
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius:30,
        // width: '100%',
        fontSize:15,
        borderWidth: 1,
        marginVertical: 10,
        flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",   
        // height: 20
    },
    activeContainer:{
        borderColor: 'rgba(0,0,0,.8)',
    },
    inactiveContainer:{
        borderColor: 'rgba(0,0,0,.05)',
        shadowColor: 'rgba(0,0,0,.05)',
        shadowRadius: 10,
        shadowOpacity: 1,
    },
    inputArea:{
        // height: "100%",
        minWidth: "70%",
        maxWidth: "100%",
        fontSize: 16,
        paddingHorizontal: 15,
        // borderWidth: 2,
        // borderStyle: "solid",
        // borderColor: "green",
    },
    submitBtn:{
        // pillRadius: 30,
        // width: "100vw",
        marginTop: 15,
        paddingVertical: 17,
        borderRadius:  30,
        alignItems: "center",
        backgroundColor: btnColor,
        elevation: 10,
    },
    activeBtn:{
        opacity: 1,
        shadowOffset: {width: -2, height: 4},  
        shadowColor: '#171717',  
        shadowOpacity: 0.5,  
        shadowRadius: 3,  
        elevation: 12,
    },
    inactiveBtn:{
        opacity: 0.4
    },
    submitBtnText:{
        fontSize: 20,
        color: "white"
    },
    formErrText:{
        color: "red"
    },
})

export default styles