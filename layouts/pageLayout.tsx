import React,{useRef} from "react";
import PropTypes from "prop-types"
import { View,ScrollView } from "react-native";
import styles from "../styles";
import { StatusBar } from 'expo-status-bar';
import Alerter from "../components/alerter";
import AddTask from "../taskScreens/addTask";
import 
    {
    useBottomSheetModal,  
    BottomSheetModal,
    } from '@gorhom/bottom-sheet';

interface Props {
    children: React.ReactNode;
    route: any;
}

const PageLayout = (props: Props) => {
    // ref
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const {dismiss} = useBottomSheetModal();

    // // variables
    const handleClosePress = () => bottomSheetRef.current?.close();
    const handleExpandPress = () => bottomSheetRef.current?.expand();
    const handleCollapsePress = () => bottomSheetRef.current?.collapse();
    const snaPindex = (num: number) => bottomSheetRef.current?.snapToIndex(num);
    const handlePresentPress = () => bottomSheetRef.current?.present();
    const handleDismissPress = () => bottomSheetRef.current?.dismiss();

    const {children,route} = props;
    if (route) {
        if (route.params !== undefined ) {
            const {showTask} = route.params;
    
            if (showTask !== undefined && showTask == true) {
                handlePresentPress();
            }
        }   
    }

    return (
        <Alerter>
            <AddTask ref={bottomSheetRef}/>
            <View style={[styles.container,styles.greyBack]}>
                <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    {children}
                    <StatusBar style="auto" />
                </ScrollView>
            </View>
        </Alerter>
    )
}

PageLayout.propTypes = {
    children: PropTypes.node.isRequired,
    route: PropTypes.object
}

export default PageLayout