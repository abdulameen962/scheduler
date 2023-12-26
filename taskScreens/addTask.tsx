import React, { useCallback, useMemo, useRef,forwardRef,useState } from 'react';
import { Text,Heading } from '@gluestack-ui/themed';
import { StyleSheet,View,Button } from 'react-native';
import {wordPredict} from "../redux/actions";
import {store} from "../redux/store";
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
// import { useAnimatedKeyboard,useAnimatedStyle } from 'react-native-reanimated';
// import Animated from 'react-native-reanimated';
interface Props {
  // children: React.ReactNode;
}

type Ref = BottomSheetModal;

const AddTask = forwardRef<Ref,Props>((props, ref) => {
  const [word,setWord] = useState<String>("");
  const [result,setResult] = useState<String>("");
  const [name,setName] = useState<String>("");
  const [startDate,setStartDate] = useState<String>("");
  const [endDate,setEndDate] = useState<String>("");
  const [descr,setDescr] = useState<String>("");

  const predictWord = async () => {
    const result = await wordPredict(store,word,1);
    
    setResult(result);
  }

  type handleFunc = typeof setName | typeof setStartDate | typeof setEndDate | typeof setDescr;

  type handleKey = "name" | "startDate" | "endDate" | "descr";

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

  const showCalendar = (key:calendarKey) => {

  }

  let formArr = {
    customInput: BottomSheetTextInput,
    form : [
        {
            Label: <Text>Task name</Text>,
            attributes:{
                placeholder:"" ,
                autoCapitalize:'none' ,
                autoComplete:'off' ,
                onChangeText: handleChange("name"),
            },
            leftIcon:{
                clickable: false,
                src: require("../assets/email.png"),
                activeSrc: require("../assets/email-active.png"),
                attributes:{}
            },
        },
        {
            Label: <Text>Start Date</Text>,
            attributes:{
                placeholder:"" ,
                autoCapitalize:'none' ,
                autoComplete:'off' ,
                // secureTextEntry:state.showPassword.show,
                // onChangeText:handleChange('password')
            },
            rightIcon:{
                clickable: true,
                src: require("../assets/eye-cancel.png"),
                activeSrc: require("../assets/eye-cancel.png"),
                attributes:{},
                onClick: showCalendar("startDate"),
                clickedImg: require("../assets/eye.png"),
            }
        },
        {
          Label: <Text>End Date</Text>,
          attributes:{
              placeholder:"" ,
              autoCapitalize:'none' ,
              autoComplete:'off' ,
              // secureTextEntry:state.showPassword.show,
              // onChangeText:handleChange('password')
          },
          rightIcon:{
              clickable: true,
              src: require("../assets/eye-cancel.png"),
              activeSrc: require("../assets/eye-cancel.png"),
              attributes:{},
              onClick: showCalendar("endDate"),
              clickedImg: require("../assets/eye.png"),
          }
      },
    ],
    // submit: {
    //     btnText: "Login",
    //     onSubmit:submitForm,
    //     disabled: state.disabled,
    // },
    // extras: [
    //     <View style={[styles.actionContainer,{paddingHorizontal:10}]}>
    //         {/* <Switch onValueChange={} value={false} /> */}
    //         <TouchableOpacity style={styles.forgot} onPress={() => props.navigation.navigate('Forgot')}>
    //             <Text style={[styles.p,styles.blueText]}>Forgot Password?</Text>
    //         </TouchableOpacity>
    //     </View>
    // ],
    // error: state.err
  }

  React.useEffect(() => {
    handleChangePrediction();
  },[result])

  const handleChangePrediction = () => {
    
  }
  // ref
  // const bottomSheetRef = useRef<BottomSheetModal>(null);
  // const {dismiss} = useBottomSheetModal();

  // variables
  const snapPoints = useMemo(() => ['30%', '50%','75%',"95%"], []);

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

//   const keyboard = useAnimatedKeyboard();
//   const translateStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateY: -keyboard.height.value }],
//     };
//   });

  const renderBackdrop = useCallback(
    (props:any) => <BottomSheetBackdrop appearsOnIndex={1} disappearsOnIndex={-1} {...props} opacity={0.4} />,
    []
  )


  // renders
  return (
        <>
          <BottomSheetModal
            ref={ref}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            backgroundStyle={{backgroundColor:'white'}}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{backgroundColor:'black'}}
          >
            <View style={[styles.container,styles.contentContainer]}>
              <Heading
                size="lg"
              >
                Create New Task
              </Heading>
            
            </View>
            </BottomSheetModal>
        </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default AddTask;