import React, { useCallback, useMemo, useRef,forwardRef,useState, useEffect } from 'react';
import { 
  Text,
  Heading,
} from '@gluestack-ui/themed';
import { StyleSheet,View,Pressable, ScrollView } from 'react-native';
import {wordPredict} from "../redux/actions";
import {store} from "../redux/store";
import Label from '../components/label';
import { userGoals } from '../redux/actions';
import 
  // BottomSheet,
    {
    BottomSheetBackdrop,  
    BottomSheetModal,
    BottomSheetScrollView,
    BottomSheetTextInput,
    BottomSheetFooter
    // useBottomSheetModal,
    } from '@gorhom/bottom-sheet';

import Form from "../form/index";
import Select from "../components/select";
// import { useAnimatedKeyboard,useAnimatedStyle } from 'react-native-reanimated';
// import Animated from 'react-native-reanimated';
interface Props {
  // children: React.ReactNode;
  navigation: any;
}

type Ref = BottomSheetModal;

const AddTask = forwardRef<Ref,Props>((props, ref) => {
  const [word,setWord] = useState<String>("");
  const [result,setResult] = useState<String>("");
  const [name,setName] = useState<String>("");
  const [startDate,setStartDate] = useState<String>("");
  const [endDate,setEndDate] = useState<String>("");
  const [descr,setDescr] = useState<String>("");
  const [goal,setGoal] = useState<String>("");
  const [disabled,setDisabled] = useState<boolean>(true);
  const [goals,setGoals] = useState<string[]>([]);
  const [gotoGoal,setGotoGoal] = useState<boolean>(false);

  const predictWord = async () => {
    const result = await wordPredict(store,word,1);
    
    setResult(result);
  }
  
  useEffect(() => {
    checkDisabled()
  },[goal,name,startDate,endDate,descr])

  const goalsFunc = useCallback(async () => {
    if (goals.length < 1) {
      let result;
      try{
        result = await userGoals(store,50);
      }
      catch(error) {
        result = [
          {
            id: null,
            title: error.message,
            click: (e) => {
              e.preventDefault();
            }
          }
        ]
      }
      const creategoal = {
        id: null,
        title: "Create Goal",
        click: () => {
          // setGotoGoal(true);
          const {navigation} = props;
          navigation.navigate("AddTask",{
            screen: "CreateGoal"
          })
        }
      }
      result.unshift(creategoal);
      setGoals(result); 
    }
  },[]);

  const checkDisabled = () => {

  }

  type handleFunc = typeof setName | typeof setStartDate | typeof setEndDate | typeof setDescr;

  type handleKey = "name" | "startDate" | "endDate" | "descr" | "goal";

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

      case "goal":
        func = setGoal;

        break;

      default:
        break;
    }

    func(val)
  }

  const showCalendar = (key:calendarKey) => {

  }

  const submitForm = () => {

  }

  let formArr = {
    customInput: BottomSheetTextInput,
    form : [
        {
            Label: <Label text="Task name"/>,
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
          // rightIcon:{
          //     clickable: true,
          //     src: require("../assets/eye-cancel.png"),
          //     activeSrc: require("../assets/eye-cancel.png"),
          //     attributes:{},
          //     onClick: showCalendar("endDate"),
          //     clickedImg: require("../assets/eye.png"),
          // }
        },
    ],
    topExtras: [
      <Select onChange={handleChange("goal")} label='Choose goal' values={goals} onOpen={() => goalsFunc()} />
    ],
    boardType: "padding"
    // error: state.err
  }

  const renderFooter = useCallback(
    props => (
      <BottomSheetFooter {...props} bottomInset={18}>
        <View>
          <Pressable>
            <Text>Create Task</Text>
          </Pressable>
        </View>
      </BottomSheetFooter>
    ),
    []
  );

  React.useEffect(() => {
    handleChangePrediction();
  },[result])

  const handleChangePrediction = () => {
    
  }
  // ref
  // const bottomSheetRef = useRef<BottomSheetModal>(null);
  // const {dismiss} = useBottomSheetModal();

  // variables
  const snapPoints = useMemo(() => ['45%','75%',"90%"], []);

  // const handleClosePress = () => bottomSheetRef.current?.close();
  // const handleExpandPress = () => bottomSheetRef.current?.expand();
  // const handleCollapsePress = () => bottomSheetRef.current?.collapse();
  // const snaPindex = (num: number) => bottomSheetRef.current?.snapToIndex(num);
  // const handlePresentPress = () => bottomSheetRef.current?.present();
  // const handleDismissPress = () => bottomSheetRef.current?.dismiss();

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
  }, []);

  const renderBackdrop = useCallback(
    (props:any) => <BottomSheetBackdrop appearsOnIndex={1} disappearsOnIndex={-1} {...props} opacity={0.5} />,
    []
  )


  // renders
  return (
        <>
          {
            gotoGoal === false && (
              <BottomSheetModal
                ref={ref}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose
                backgroundStyle={{backgroundColor:'white'}}
                backdropComponent={renderBackdrop}
                handleIndicatorStyle={{backgroundColor:'black'}}
                keyboardBehavior="fillParent"
                keyboardBlurBehavior='restore'
                // footerComponent={renderFooter}
              >
                <BottomSheetScrollView contentContainerStyle={[styles.container]} >
                  <Heading
                    size="lg"
                  >
                    Create New Task
                  </Heading>
                  <Form {...formArr} />
                </BottomSheetScrollView>
                </BottomSheetModal>
            )
          }
        </>
  );
});

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 24,
    backgroundColor: 'white',
  },
  contentContainer: {
    // flex: 1,
    // alignItems: 'center',
  },
  inputStyle: {
    paddingHorizontal: 0,
    paddingVertical: 1,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: 'rgba(0,0,0,.06)',
  },
  activeInput: {
    borderColor: 'rgba(0,0,0,1)',
  },
  styled:{
    paddingHorizontal: 2
  }
});

export default AddTask;