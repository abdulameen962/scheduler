import React from "react";
import { Text } from "@gluestack-ui/themed";
import { View } from "react-native";
// import styles from "../../styles";
import PageLayout from "../../layouts/pageLayout";
import Form from "../../form";
import { Pressable } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {width} from "../../components/homeHeader";
import {styles} from "../addTask";
import Label from '../../components/label';
import { goalCreation } from "../../redux/actions";
import { trim,tryParseDateFromString } from "../../helpfulFunc";
import { connect } from 'react-redux';

interface NavigationProps {
    setOptions: Function,
    goBack: Function,
}

interface Props {
    navigation: NavigationProps,
    route: {params: {showTask: boolean}}
}

const CreateGoal = (props:Props) => {
    const [name,setName] = React.useState<String>("");
    const [startDate,setStartDate] = React.useState<String>("");
    const [endDate,setEndDate] = React.useState<String>("");
    const [descr,setDescr] = React.useState<String>(null);
    const [image,setImage] = React.useState<String>(null);
    const [disabled,setDisabled] = React.useState<boolean>(true);

    React.useEffect(() => {
        checkDisabled()
    },[name,startDate,endDate,descr,image]);
    
    const checkDisabled = () => {
        if (trim(name).length > 4 &&
            tryParseDateFromString(startDate) < tryParseDateFromString(endDate) &&
            descr != null &&
            trim(descr).length > 12 &&
            trim(descr).length <= 500 &&
            image != null) 
            setDisabled(false);
    }

    type handleFunc = typeof setName | typeof setImage | typeof setStartDate | typeof setEndDate | typeof setDescr;

    type handleKey = "name" | "startDate" | "endDate" | "descr" | "image";
  
    type calendarKey = "startDate" | "endDate";

    const handleChange = (key: handleKey) => (val:String) => {
        let func: handleFunc;
        switch (key) {
          case "name":
            func = setName;
            break;
    
          case "startDate":
            func = setStartDate;
            break;
    
          case "endDate":
            func = setEndDate;
    
            break;
    
          case "descr":
            func = setDescr;
    
            break;
    
          default:
            break;
        }
    
        func(val)
      }

    const {navigation} = props;
    navigation.setOptions({
        headerLeft: (prop: any) => {
            return (
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="close-outline" color={"rgba(0,0,0,.9)"} size={30} />
                </Pressable>
            )
        }
    })

    let formArr = {
        form : [
            {
                Label: <Label text="Name of goal"/>,
                attributes:{
                    autoCapitalize:'none' ,
                    autoComplete:'off' ,
                    onChangeText: handleChange("name"),
    
                },
                inputStyle: [styles.inputStyle],
                activeInput: [styles.activeInput],
                styled: styles.styled,
            },
            {
                Label: <Label text={"Start Date"} />,
                attributes:{
                    autoCapitalize:'none' ,
                    autoComplete:'off' ,
                    // secureTextEntry:state.showPassword.show,
                    // onChangeText:handleChange('password')
                },
                inputStyle: [styles.inputStyle],
                activeInput: [styles.activeInput],
                styled: styles.styled,
                // rightIcon:{
                //     clickable: true,
                //     src: require("../assets/eye-cancel.png"),
                //     activeSrc: require("../assets/eye-cancel.png"),
                //     attributes:{},
                //     onClick: showCalendar("startDate"),
                //     clickedImg: require("../assets/eye.png"),
                // }
            },
            {
              Label: <Label text="End Date" />,
              attributes:{
                  autoCapitalize:'none' ,
                  autoComplete:'off' ,
                  // secureTextEntry:state.showPassword.show,
                  // onChangeText:handleChange('password')
              },
              inputStyle: [styles.inputStyle],
              activeInput: [styles.activeInput],
              styled: styles.styled,
              // rightIcon:{
              //     clickable: true,
              //     src: require("../assets/eye-cancel.png"),
              //     activeSrc: require("../assets/eye-cancel.png"),
              //     attributes:{},
              //     onClick: showCalendar("endDate"),
              //     clickedImg: require("../assets/eye.png"),
              // }
            },
    
            {
              Label: <Label text="Description" />,
              attributes:{
                  autoCapitalize:'none' ,
                  autoComplete:'off' ,
                  multiline: true,
                  // secureTextEntry:state.showPassword.show,
                  // onChangeText:handleChange('password')
              },
              inputStyle: [styles.inputStyle],
              activeInput: [styles.activeInput],
              styled: {...styles.styled,minHeight:70},
            },
        ],

        extras : [
            // image camera component user can only choose

        ],
        submit: {
            btnText: "Create Goal",
            // onSubmit:this.submitForm,
            // disabled: this.state.disabled,
        },
        boardType: "padding"
        // error: state.err
      }

    return (
        <PageLayout {...props} headerShow={true}>
            <View style={[{width,}]}>
                <Form {...formArr} />
            </View>
        </PageLayout>
    )
}

const mapStateToProps = (state:any,ownProps:any) => ({
    err: state.user.errMessage || null,
    success: state.user.successMessage || null,
})

export default connect(mapStateToProps,{goalCreation})(CreateGoal);