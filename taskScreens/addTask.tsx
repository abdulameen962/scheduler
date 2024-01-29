import React, { useCallback, useMemo, useRef,forwardRef,useState, useEffect } from 'react';
import BottomSheetLayout from '../layouts/bottomSheetLayout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { 
  Text,
  Heading,
} from '@gluestack-ui/themed';
import { StyleSheet,View,Pressable, ScrollView } from 'react-native';
import {wordPredict} from "../redux/actions";
import {store} from "../redux/store";
import Label from '../components/label';
import { userGoals,userLabels } from '../redux/actions';
import CalendarBottom from "../components/calendarBottom";
import { trim,tryParseDateFromString } from "../helpfulFunc";
import 
  // BottomSheet,
    {
    BottomSheetModal,
    BottomSheetTextInput,
    BottomSheetFooter,
    useBottomSheetModal,
    } from '@gorhom/bottom-sheet';

import Form from "../form/index";
import Select from "../components/select";
// import { useAnimatedKeyboard,useAnimatedStyle } from 'react-native-reanimated';
// import Animated from 'react-native-reanimated';
interface Props {
  // children: React.ReactNode;
  navigation: any;
  err:String;
  taskCreation:Function,
  sucess: String,
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
  const [goals,setGoals] = useState<Object[]>([]);
  const [label,setLabel] = useState<String>("");
  const [labelContainer,setlabelContainer] = useState<Object[]>([]);
  const [currentCalendar,setCurrentCalendar] = React.useState<calendarKey>(null)

  const predictWord = async () => {
    const result = await wordPredict(store,word,1);
    
    setResult(result);
  }
  const submitForm = async () => {
    if (!disabled) {
      const {taskCreation,navigation} = props;
      const task = {
        goal_id: goal,
        task_name: name,
        task_description: descr,
        deadline: endDate,
        labels: label,
        start_time: startDate,
      }
      const result = await taskCreation(task);
      if (result) navigation.setParams({showTask:false,refresh:true})
    }
  }

  useEffect(() => {
    checkDisabled()
  },[goal,name,startDate,endDate,descr,label])

  const goalsFunc = useCallback(async () => {
    if (goals.length < 1) {
      let result:Object[];
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
          const {navigation} = props;
          navigation.navigate("AddTask",{
            screen: "CreateGoal",
            params:{
              showTask: false
            }
          })
        }
      }
      result.unshift(creategoal);
      setGoals(result); 
    }
  },[]);


  const labelsFunc = useCallback(async() => {
    if (labelContainer.length < 1) {
      let result:Object[];
      try{
        result = await userLabels(store);
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
      setlabelContainer(result);
    }
  },[])

  const checkDisabled = () => {
    if (trim(name).length > 4 &&
      tryParseDateFromString(startDate) < tryParseDateFromString(endDate) &&
      descr != null &&
      trim(descr).length > 12 &&
      trim(descr).length <= 500 &&
      trim(goal).length > 0 &&
      trim(label).length > 0
    ) 
    setDisabled(false);

    else{
        if (!disabled) {
            setDisabled(true);
        }
    }
  }

  type handleFunc = typeof setName | typeof setStartDate | typeof setEndDate | typeof setDescr;

  type handleKey = "name" | "startDate" | "endDate" | "descr" | "goal" | "label";

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

      case "label":
        func = setLabel

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
    dismiss();
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
        },
        inputStyle: [styles.inputStyle],
        activeInput: [styles.activeInput],
        styled: {...styles.styled,minHeight:70},
      },
    ],
    topExtras: [
      <Select onChange={handleChange("goal")} label='Choose goal' values={goals} onOpen={() => goalsFunc()} />,
      <Select onChange={handleChange("label")} label='Choose Task label' values={labelContainer} onOpen={() => labelsFunc()} />
    ],
    submit: {
      btnText: "Create Task",
      onSubmit:() => submitForm(),
      disabled: disabled,
    },
    boardType: "padding",
    error: props.err,
    sucess: props.sucess,
  }

  const renderFooter = useCallback(
    (props) => (
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

  // renders
  return (
      <>
        <BottomSheetLayout ref={ref} renderFooter={renderFooter} >
            <CalendarBottom ref={bottomSheetRef} onSubmit={submitDate} />
            <Heading
                  size="lg"
                >
                  Create New Task
            </Heading>
            <Form {...formArr} />
        </BottomSheetLayout>
      </>
  );
});

export const styles = StyleSheet.create({
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
    paddingHorizontal: 5,
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