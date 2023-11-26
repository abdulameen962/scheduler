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
      marginVertical: Constants.statusBarHeight,
    },
    blueText:{
      color:blue
    },  
    formContainer:{paddingHorizontal:20,justifyContent:"flex-start",paddingVertical:35},
    greyBack:{
      backgroundColor:greyBackground
    },
    textBg:{
      color: btnColor
    },
    homestyle:{
      width: 320,
      maxWidth: "90%",
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
      fontSize: 14,
      color: "rgba(0,0,0,.35)",
      paddingVertical: 9,
      lineHeight: 20
    },

  });

export default styles