import React,{useRef} from "react";
import PropTypes from "prop-types"
import { View } from "react-native";
import styles from "../styles";
import { StatusBar } from 'expo-status-bar';
import Alerter from "../components/alerter";
import AddTask from "../taskScreens/addTask";
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from "react-native-reanimated";
import 
    {
    useBottomSheetModal,  
    BottomSheetModal,
    } from '@gorhom/bottom-sheet';

interface Props {
    children: React.ReactNode;
    route: any;
    navigation: any;
    headerShow: boolean;
}

const PageLayout = (props: Props) => {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOfset = useScrollViewOffset(scrollRef);

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollOfset.value,
                [0,200],
                [0.1,1]
            )
        }
    })

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
    if (props.headerShow) {
        props.navigation.setOptions({
            headerBackground: () => <Animated.View style={[styles.headerBackground,headerAnimatedStyle]}/>
        })  
    }

    if (route) {
        if (route.params !== undefined ) {
            const {showTask} = route.params;
    
            if (showTask !== undefined && showTask == true) {
                handlePresentPress();
            }
        }   
    }

    return (
        <>
            <Alerter>
                <AddTask ref={bottomSheetRef}/>
                <View style={[styles.containerLayout,styles.greyBack]}>
                    <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                        {children}
                        <StatusBar style="auto" />
                    </Animated.ScrollView>
                </View>
            </Alerter>
        </>
    )
}

PageLayout.propTypes = {
    children: PropTypes.node.isRequired,
    route: PropTypes.object
}

export default PageLayout