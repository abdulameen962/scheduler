import React,{useRef} from "react";
import PropTypes from "prop-types"
import { View } from "react-native";
import styles from "../styles";
import { StatusBar } from 'expo-status-bar';
import Alerter from "../components/alerter";
import AddTask from "../taskScreens/addTask";
import { store } from "../redux/store";
import { taskCreation } from "../redux/actions";
import { connect } from 'react-redux';
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
    err: String;
    taskCreation: Function;
    sucess: String;
    addPadding: boolean;
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
    React.useEffect(() => {
        if (props.headerShow) {
            props.navigation.setOptions({
                headerBackground: () => <Animated.View style={[styles.headerBackground,headerAnimatedStyle]}/>
            })  
        }
    },[])

    if (route) {
        if (route.params !== undefined ) {
            const {showTask} = route.params;
    
            if (showTask !== undefined && showTask == true) {
                handlePresentPress();
            }
            else{
                dismiss();
            }
        }   
    }

    const getStyles = () => {
        let result = [styles.containerLayout,styles.greyBack]
        if (props.addPadding) {
            result.push({marginTop:70})
        }
        return result;
    }

    return (
        <>
            <Alerter>
                <AddTask ref={bottomSheetRef} sucess={props.sucess} navigation={props.navigation} taskCreation={
                    async (task:Object) => {
                        return await props.taskCreation(store,task);
                    }
                    
                } err={props.err}/>
                <View style={getStyles()}>
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

const mapStateToProps = (state:any,ownProps:any) => ({
    err: state.user.errMessage || null,
    success: state.user.successMessage || null,
    ...ownProps,
})

export default connect(mapStateToProps,{taskCreation})(PageLayout);