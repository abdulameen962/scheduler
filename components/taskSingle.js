import React from"react"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Spinner,View,Text,Pressable,Heading,Image,Button,ButtonText } from "@gluestack-ui/themed";
import styles from "../styles";
import { tryParseDateFromString } from "../helpfulFunc";

const taskSingle = ({item}) => {
    let {goal,labels,prob_completion,title,start_time_date,deadline_date } = item;
    let mainDate = tryParseDateFromString(deadline_date);
    const monthOfYear = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const endDate = `${monthOfYear[mainDate.getMonth()]} ${mainDate.getDate()}, ${mainDate.getFullYear()}`;
    start_time_date = `${mainDate.toLocaleTimeString()}`;
    mainDate = tryParseDateFromString(deadline_date);   
    deadline_date = `${tryParseDateFromString(deadline_date).toLocaleTimeString()}`;
    // console.log(mainDate.getUTCHours());
    // console.log(mainDate.getUTCMinutes());
    const {goal_image} = goal;
    return (
        <View
            mb="$4"
            rounded="$2xl"
            paddingVertical="$5"
            paddingHorizontal="$6"
            backgroundColor={"rgba(255, 255, 255,.8)"}
        >
            <View style={[styles.orContainer]}>
                <View>
                    { 
                        labels.map((label,index) => {
                            const {color,name,id} = label;
                            return (
                            <Button key={id}
                                rounded="$3xl"
                                backgroundColor={color}
                                pt="$2"
                                pb="$3"
                                pl="$3"
                                pr="$3"
                                mr="$5"
                                size="md"
                                variant="solid"
                                isFocusVisible={false}
                                maxWidth={70}
                            >
                                <ButtonText bold size="sm">{name}</ButtonText>
                            </Button>
                            )
                        })
                    }
                </View>
                <View>
                    <Text> {prob_completion * 100}%</Text>
                </View>
            </View>
            <View mt="$4">
                <Heading size="$sm">{title}</Heading>
                <View style={[{flexDirection:"row",alignItems:"center"}]} mt="$3">
                    <MaterialCommunityIcons name="clock-outline" color="#B0B0B0" size={25} />
                    <Text color="$secondary300" ml="$3">{start_time_date} - {deadline_date}</Text>
                </View>
            </View>
            <View style={[styles.orContainer]} pt="$5">
                <View style={[{flexDirection:"row"}]}>
                    <Text>Due date:</Text>
                    <Text bold> {endDate}</Text>
                </View>
                <View>
                    <Image
                        alt={title}
                        source={{uri: goal_image}}
                        resizeMode="contain"
                        width={30}
                        height={30}
                    />
                </View>
            </View>
        </View>
    )
}

export default taskSingle;