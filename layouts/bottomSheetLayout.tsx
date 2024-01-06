import React, { useCallback, useMemo,forwardRef} from 'react';
import { StyleSheet} from 'react-native';
import 
  // BottomSheet,
    {
    BottomSheetBackdrop,  
    BottomSheetModal,
    BottomSheetScrollView,
    BottomSheetTextInput,
    BottomSheetFooter
    } from '@gorhom/bottom-sheet';

interface Props {
  children: React.ReactNode;
//   renderFooter: () => JSX.Element;
  renderFooter: any;
}

type Ref = BottomSheetModal;

const BottomSheetLayout = forwardRef<Ref,Props>((props, ref) => {
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

  return (
        <>
        <BottomSheetModal
            ref={ref}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose
            backgroundStyle={{backgroundColor:'white',borderRadius:30}}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{backgroundColor:'black'}}
            keyboardBehavior="fillParent"
            keyboardBlurBehavior='restore'
            // footerComponent={props.renderFooter}
        >
            <BottomSheetScrollView contentContainerStyle={[styles.container]} >
                {props.children}
            </BottomSheetScrollView>
        </BottomSheetModal>
        </>
    );
})

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


export default BottomSheetLayout;