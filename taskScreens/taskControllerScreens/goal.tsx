import React from "react";
import { Text } from "@gluestack-ui/themed";
import { TextInput, View } from "react-native";
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
import { getPreviousPage } from "../../nativeHelpers";
import 
    {
    useBottomSheetModal,  
    BottomSheetModal,
    } from '@gorhom/bottom-sheet';

interface NavigationProps {
    setOptions: Function,
    goBack: Function,
    navigate: Function,
}

interface Props {
    navigation: NavigationProps,
    route: {params: {showTask: boolean}},
    goalCreation: Function,
    err: string | null,
    success: string | null
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
    const [descr,setDescr] = React.useState<String>("");
    const [image,setImage] = React.useState<String>(null);
    const [currentCalendar,setCurrentCalendar] = React.useState<calendarKey>(null)
    const [disabled,setDisabled] = React.useState<boolean>(true);
    const [err,setErr] = React.useState<string>(null);
    const [sucess,setSucess] = React.useState<string>(null);

    React.useEffect(() => {
        checkDisabled()
    },[name,startDate,endDate,descr,image]);

    React.useEffect(() => {
        if (props.err != null && props.err !== err) setErr(props.err);
    },[props.err])

    React.useEffect(() => {
        if (props.success != null && props.success !== sucess) {
            setSucess(props.success);
            setRefresh();
        };
    },[props.success]);

    const setRefresh = () => {
        setName("");
        setStartDate("");
        setEndDate("");
        setDescr("");
        setImage(null);
        setErr(null);
    }

    React.useEffect(() => {
        const {navigation} = props;
        navigation.setOptions({
            headerLeft: (prop: any) => {
                return (
                    <Pressable onPress={() => {
                        setRefresh();
                        navigation.navigate(getPreviousPage(navigation),{showTask:false,refresh:true});
                    }}>
                        <Ionicons name="close-outline" color={"rgba(0,0,0,.9)"} size={30} />
                    </Pressable>
                )
            }
        })
        setErr(props.err);
    },[])
    
    const checkDisabled = () => {
        if (trim(name).length > 4 &&
            tryParseDateFromString(startDate) < tryParseDateFromString(endDate) &&
            descr != null &&
            trim(descr).length > 12 &&
            trim(descr).length <= 500 &&
            image != null) 
            setDisabled(false);

        else{
            if (!disabled) {
                setDisabled(true);
            }
        }
    }

    type handleFunc = typeof setName | typeof setImage | typeof setStartDate | typeof setEndDate | typeof setDescr;

    type handleKey = "name" | "descr" | "image";
  
    type calendarKey = "startDate" | "endDate";

    const handleChange = (key: handleKey) => (val:String) => {
        let func: handleFunc;
        switch (key) {
            case "name":
                func = setName;
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

    // ref
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const {dismiss} = useBottomSheetModal();

    // // variables
    const handleClosePress = () => bottomSheetRef.current?.close();
    const handleExpandPress = () => bottomSheetRef.current?.expand();
    const handleCollapsePress = () => bottomSheetRef.current?.collapse();
    const snaPindex = (num: number) => bottomSheetRef.current?.snapToIndex(num);
    const handlePresentPress = () => bottomSheetRef.current?.present();
    const handleDismissPress = () => bottomSheetRef.current?.dismiss();

    const showCalendar = (key: calendarKey) => {
        setCurrentCalendar(key);
        handlePresentPress();
    }

    const submitDate = (val:string) => {
        const key = currentCalendar;
        switch (key) {
            case "startDate":
                setStartDate(`${val} 00:00:00`);
                break;

            case "endDate":
                setEndDate(`${val} 00:00:00`);
                break;
        
            default:
                break;
        }

    }

    const submitGoal = async () => {
        const {navigation} = props;
        if (!disabled) {
            const result = await props.goalCreation(store,{goal_name:name,goal_description:descr,start_time:startDate,deadline:endDate,image,});
            if (result) props.navigation.navigate(getPreviousPage(navigation),{showTask:true,refresh:true})  
        }
    }

    let formArr = {
        form : [
            {
                Label: <Label text="Name of goal"/>,
                attributes:{
                    autoCapitalize:'none' ,
                    autoComplete:'off' ,
                    onChangeText: handleChange("name"),
                    value: name,
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
                    value: startDate,
                    editable:false,
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
                    value: endDate,
                    editable:false,
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
                  onChangeText: handleChange("descr"),
                  value: descr,
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
            onSubmit:() => submitGoal(),
            disabled: disabled,
        },
        // boardType: "padding"
        error: err,
        sucess,
      }

    return (
        <>
            <CalendarBottom ref={bottomSheetRef} onSubmit={submitDate} />
            <PageLayout {...props} headerShow={true} addPadding={true}>
                <View style={[{width}]}>
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