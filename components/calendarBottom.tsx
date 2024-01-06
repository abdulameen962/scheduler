import React, {useState, Fragment, useCallback, useMemo, useRef} from 'react';
import {StyleSheet, View, ScrollView, Text, TouchableOpacity} from 'react-native';
import {Calendar, CalendarUtils} from 'react-native-calendars';
import 
    {
    useBottomSheetModal,  
    BottomSheetModal,
    BottomSheetScrollView
    } from '@gorhom/bottom-sheet';


import BottomSheetLayout from "../layouts/bottomSheetLayout";
import Ionicons from 'react-native-vector-icons/Ionicons';

const getCurrentDate = () => {
    const date = new Date();
    const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return currentDate;
}

const INITIAL_DATE = getCurrentDate();

interface Props {
    onSubmit: (date: string) => void;
}

type Ref = BottomSheetModal;

const CalendarBottom = React.forwardRef<Ref,Props>((props,ref) => {
    const [selected, setSelected] = useState(INITIAL_DATE);
    
    React.useEffect(() => {
        const {onSubmit} = props;
        onSubmit(selected);
    },[selected])

    const getDate = (count: number) => {
        const date = new Date(INITIAL_DATE);
        const newDate = date.setDate(date.getDate() + count);
        return CalendarUtils.getCalendarDateString(newDate);
    };
    
    const onDayPress = useCallback((day) => {
        setSelected(day.dateString);
    }, []);
    
    const marked = useMemo(() => {
        return {
          [getDate(-1)]: {
            // dotColor: 'red',
            marked: true
          },
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            // selectedColor: 'orange',
            // selectedTextColor: 'red'
          }
        };
    }, [selected]);

    const renderCalendarWithSelectableDate = () => {
        return (
          <Fragment>
            {/* <Text style={styles.text}>Calendar with selectable date</Text> */}
            <Calendar
            //   testID={testIDs.calendars.FIRST}
              enableSwipeMonths
              current={INITIAL_DATE}
              minDate={getDate(1)}
              style={styles.calendar}
              onDayPress={onDayPress}
              markedDates={marked}
              renderArrow={direction => {
                if (direction == "left") {
                    return (
                        <Ionicons name="chevron-back-outline"  color={"#00BBF2"} size={25}/>
                    )
                }
                return (<Ionicons name="chevron-forward-outline"  color={"#00BBF2"} size={25}/>)
            }}
            />
          </Fragment>
        );
      };
    
      const renderCalendar = () => {
        return (
          <Fragment>
            {renderCalendarWithSelectableDate()}
          </Fragment>
        );
      };
    
    return (
        <BottomSheetLayout ref={ref} renderFooter={{}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {renderCalendar()}
            </ScrollView>
        </BottomSheetLayout>
    );
})

export default CalendarBottom;

const styles = StyleSheet.create({
    calendar: {
      marginBottom: 10
    },
    switchContainer: {
      flexDirection: 'row',
      margin: 10,
      alignItems: 'center'
    },
    switchText: {
      margin: 10,
      fontSize: 16
    },
    text: {
      textAlign: 'center',
      padding: 10,
      backgroundColor: 'lightgrey',
      fontSize: 16
    },
    disabledText: {
      color: 'grey'
    },
    defaultText: {
      color: 'purple'
    },
    customCalendar: {
      height: 250,
      borderBottomWidth: 1,
      borderBottomColor: 'lightgrey'
    },
    customDay: {
      textAlign: 'center'
    },
    customHeader: {
      backgroundColor: '#FCC',
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginHorizontal: -4,
      padding: 8
    },
    customTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10
    },
    customTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#00BBF2'
    }
});