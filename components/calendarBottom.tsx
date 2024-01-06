import React from "react";
import 
    {
    useBottomSheetModal,  
    BottomSheetModal,
    } from '@gorhom/bottom-sheet';

import {Calendar, CalendarUtils} from 'react-native-calendars';

import BottomSheetLayout from "../layouts/bottomSheetLayout";
import { Text } from "@gluestack-ui/themed";
import Ionicons from 'react-native-vector-icons/Ionicons';


interface Props {

}



const CalendarBottom = (props: Props) => {
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

    return (    
            <BottomSheetLayout ref={bottomSheetRef} renderFooter={{}}>
                <Calendar
                // Initially visible month. Default = now
                initialDate={'2012-03-01'}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={'2012-05-10'}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                maxDate={'2012-05-30'}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={day => {
                    console.log('selected day', day);
                }}
                // Handler which gets executed on day long press. Default = undefined
                onDayLongPress={day => {
                    console.log('selected day', day);
                }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={'yyyy MM'}
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                onMonthChange={month => {
                    console.log('month changed', month);
                }}
                // Hide month navigation arrows. Default = false
                hideArrows={true}
                // Replace default arrows with custom ones (direction can be 'left' or 'right')
                renderArrow={direction => {
                    if (direction == "left") {
                        return (
                            <Ionicons name="arrow-back-outline"  color={"rgba(0,0,0,.9)"} size={30}/>
                        )
                    }
                    return (<Ionicons name="arrow-forward-outline"  color={"rgba(0,0,0,.9)"} size={30}/>)
                }}
                // Do not show days of other months in month page. Default = false
                hideExtraDays={true}
                // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
                // day from another month that is visible in calendar page. Default = false
                disableMonthChange={true}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
                firstDay={1}
                // Hide day names. Default = false
                hideDayNames={true}
                // Show week numbers to the left. Default = false
                showWeekNumbers={true}
                // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                onPressArrowLeft={subtractMonth => subtractMonth()}
                // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                onPressArrowRight={addMonth => addMonth()}
                // Disable left arrow. Default = false
                disableArrowLeft={true}
                // Disable right arrow. Default = false
                disableArrowRight={true}
                // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                disableAllTouchEventsForDisabledDays={true}
                // Replace default month and year title with custom one. the function receive a date as parameter
                // renderHeader={date => {
                //     /*Return JSX*/
                //     <Text>heelo</Text>
                // }}
                // Enable the option to swipe between months. Default = false
                enableSwipeMonths={true}
                />
            </BottomSheetLayout>
    )
}

export default CalendarBottom;