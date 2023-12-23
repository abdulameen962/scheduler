import React from "react"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Spinner,View,Text,Pressable,Heading,Image,Button,ButtonText } from "@gluestack-ui/themed";

const taskSingle = ({item}:any) => {
    const {goal,labels,prob_completion,title,start_time_date,deadline_date } = item;
    const {goal_image} = goal;
    return (
        <View
            mb="$4"
            rounded="$2xl"
            paddingVertical="$7"
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
            <View>
                <Heading>{title}</Heading>
                <View style={[{flexDirection:"row"}]}>
                    <MaterialCommunityIcons name="clock-outline" color="black" size={25} />
                    <View>
                        <Text>{start_time_date} - {deadline_date}</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.orContainer]}>
                <View>
                    <Text>Due date:</Text>
                    <Text>{deadline}</Text>
                </View>
                <View>
                    <Image
                        alt={title}
                        source={{uri: goal_image}}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </View>
    )
}

export default taskSingle;