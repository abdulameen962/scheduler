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
import { store } from "../../redux/store";
import { connect } from 'react-redux';
import CustomSelect from "../../components/select";
import CalendarBottom from "../../components/calendarBottom";

interface NavigationProps {
    setOptions: Function,
    goBack: Function,
}

interface Props {
    navigation: NavigationProps,
    route: {params: {showTask: boolean}},
    goalCreation: Function,
    err: string | null
}

const imgChoices = [
    {
        title:"Block",
        id:"https://res.cloudinary.com/abdulameen/image/upload/v1703262365/pic1_yge1z0.png",
        image:{uri:"https://res.cloudinary.com/abdulameen/image/upload/v1703262365/pic1_yge1z0.png"},
    },
    {
        title:"Horse",
        id:"https://res.cloudinary.com/abdulameen/image/upload/v1703262365/pic2_a0ukhq.png",
        image:{uri:"https://res.cloudinary.com/abdulameen/image/upload/v1703262365/pic2_a0ukhq.png"},
    },
    {
        title:"Plane",
        id:"https://res.cloudinary.com/abdulameen/image/upload/v1703262902/pic3_o471pa.png",
        image:{uri:"https://res.cloudinary.com/abdulameen/image/upload/v1703262902/pic3_o471pa.png"},
    },
]

const CreateGoal = (props:Props) => {
    const [name,setName] = React.useState<String>("");
    const [startDate,setStartDate] = React.useState<String>("");
    const [endDate,setEndDate] = React.useState<String>("");
    const [descr,setDescr] = React.useState<String>(null);
    const [image,setImage] = React.useState<String>(null);
    const [disabled,setDisabled] = React.useState<boolean>(true);
    const [calendarShow,setCalendarShow] = React.useState<boolean>(false);

    React.useEffect(() => {
        checkDisabled()
    },[name,startDate,endDate,descr,image]);

    React.useEffect(() => {
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
    },[])
    
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

            case "image":
                func = setImage;

                break;
        
            default:
                break;
        }
    
        func(val)
    }

    const showCalendar = (key: calendarKey) => {
        setCalendarShow(true);
    }

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
                Label: <Label text="Start Date" />,
                attributes:{
                    autoCapitalize:'none' ,
                    autoComplete:'off' ,
                    // secureTextEntry:state.showPassword.show,
                    // onChangeText:handleChange('password')
                },
                inputStyle: [styles.inputStyle],
                activeInput: [styles.activeInput],
                styled: styles.styled,
                rightIcon:{
                    clickable: true,
                    src: [<Ionicons name="calendar-outline" color={"rgba(0,0,0,.2)"} size={25} />],
                    activeSrc: [<Ionicons name="calendar-outline" color={"rgba(0,0,0,1)"} size={27} />],
                    attributes:{},
                    onClick: () => showCalendar("startDate"),
                    clickedImg: [<Ionicons name="calendar-outline" color={"rgba(0,0,0,.2)"} size={25} />],
                }
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
                  rightIcon:{
                      clickable: true,
                      src: [<Ionicons name="calendar-outline" color={"rgba(0,0,0,.2)"} size={25} />],
                      activeSrc: [<Ionicons name="calendar-outline" color={"rgba(0,0,0,1)"} size={27} />],
                      attributes:{},
                      onClick: () => showCalendar("endDate"),
                      clickedImg: [<Ionicons name="calendar-outline" color={"rgba(0,0,0,1)"} size={27} />],
                  }
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

        topExtras : [                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
            // images user can only choose
            <CustomSelect onChange={handleChange("image")} label='Choose image' values={imgChoices} onOpen={() => {}} />,

        ],
        submit: {
            btnText: "Create Goal",
            onSubmit:props.goalCreation(store,{goal_name:name,goal_description:descr,start_time:startDate,deadline:endDate,image,}),
            disabled: disabled,
        },
        // boardType: "padding"
        error: props.err
      }

    return (
        <>
            <CalendarBottom />
            <PageLayout {...props} headerShow={true}>
                <View style={[{width,marginTop:70}]}>
                    <Form {...formArr} />
                </View>
            </PageLayout>
        </>
    )
}

const mapStateToProps = (state:any,ownProps:any) => ({
    err: state.user.errMessage || null,
    success: state.user.successMessage || null,
})

export default connect(mapStateToProps,{goalCreation})(CreateGoal);