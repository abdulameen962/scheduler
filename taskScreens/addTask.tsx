import React, { useCallback, useMemo, useRef } from 'react';
import { Text } from '@gluestack-ui/themed';
import { StyleSheet,View,Button } from 'react-native';
import BottomSheet,{
    BottomSheetBackdrop,  
    BottomSheetModal,
    useBottomSheetModal,
    } from '@gorhom/bottom-sheet';
import { useAnimatedKeyboard,useAnimatedStyle } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

const AddTask = props => {
  // ref
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const {dismiss} = useBottomSheetModal();

  // variables
  const snapPoints = useMemo(() => ['30%', '50%','75%'], []);

  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleExpandPress = () => bottomSheetRef.current?.expand();
  const handleCollapsePress = () => bottomSheetRef.current?.collapse();
  const snaPindex = (num: number) => bottomSheetRef.current?.snapToIndex(num);
  const handlePresentPress = () => bottomSheetRef.current?.present();
  const handleDismissPress = () => bottomSheetRef.current?.dismiss();

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
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
            <View style={{marginTop:30}}>
                <Button title='Present' onPress={handlePresentPress} />
                <Button title='Dismiss' onPress={handleDismissPress} />
            </View>
            <BottomSheetModal
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose={true}
                backgroundStyle={{backgroundColor:'white'}}
                backdropComponent={renderBackdrop}
                handleIndicatorStyle={{backgroundColor:'black'}}
            >
                <View style={[styles.container,styles.contentContainer]}>
                <Text>Awesome 🎉</Text>
                
                </View>
            </BottomSheetModal>
        </>
  );
};

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