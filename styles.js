import { StyleSheet } from "react-native";
import Constants from 'expo-constants';

const btnColor = "#3E4ADE";
const blue = "#0094DC"
const greyBackground = "#F4F6F8";
const button = {
  pillRadius: 30,
  width: "100%",
  paddingVertical: 17,
  borderRadius:  30,
  alignItems: "center",
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: Constants.statusBarHeight,
    },
    orContainer:{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },  
    greyLine:{
      width: "45%",
      height: 2,
      backgroundColor: "rgba(0,0,0,.05)"
    },
    blueText:{
      color:blue
    },  
    formContainer:{paddingHorizontal:20,justifyContent:"flex-start",paddingVertical:35},
    greyBack:{
      backgroundColor:greyBackground
    },
    googleBtn:{
      justifyContent:"center",
      alignItems:"center",
      paddingHorizontal:30,
      paddingVertical: 5,
      borderRadius: 30,
      borderColor: "rgba(0,0,0,.3)",
      borderStyle: "solid",
      borderWidth:1,
      marginVertical: 15,
      marginBottom: 10,
    },
    googleText:{
      fontSize: 14,
      fontWeight: 500,
      paddingLeft: 5
    },
    googleImg:{
        maxWidth:25
    },
    textBg:{
      color: btnColor
    },
    boxContainer:{
      marginTop: 20,
      // paddingHorizontal: 0,
    },
    homestyle:{
      width: 320,
      maxWidth: "90%",
      marginBottom: 35,
    },
    primaryBtn:{
      backgroundColor: btnColor,
      ...button,

    },
    secondaryBtn:{
      ...button,
      marginTop: 15
    },
    whiteColor:{
      color: "#fff",
    },
    buttonSize: {
      fontSize: 20
    },
    homeImg:{
      width: "100%",
      height: 300,
      minHeight:"65%",
    },
    header1:{
      fontSize: 40,
      fontWeight: "bold",
    },
    header3:{
      fontSize: 25,
      fontWeight: "bold",
    },
    headerImg:{
      maxWidth: 60,
      // borderWidth:1,
      // borderColor:"black",
      // borderStyle:"dashed"
    },
    input: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderRadius:8,
      // width: '100%',
      fontSize:15,
      borderColor: 'rgba(0,0,0,.15)',
      borderWidth: 1,
      marginVertical: 10,
    },
    form:{
      // minWidth: "80%",
      // borderWidth: 2,
      // borderStyle: "solid",
      // borderColor: greyBackground,
      marginTop: 20
    },
    actionContainer:{
      marginTop: 0,
    },
    p:{
      fontSize: 13,
      color: "rgba(0,0,0,.35)",
      paddingVertical: 9,
      lineHeight: 20
    },

  });

export default styles