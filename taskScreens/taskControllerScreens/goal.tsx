import React from "react";
import { Text } from "@gluestack-ui/themed";
import { View } from "react-native";
import styles from "../../styles";
import PageLayout from "../../layouts/pageLayout";

interface NavigationProps {
    setOptions: Function
}

interface Props {
    navigation: NavigationProps
}

const CreateGoal = (props:Props) => {
    // const {navigation} = props;
    // navigation.setOptions({
    //     headerShown: false,
    //     tabBarStyle: {
    //         display: "none"
    //     },
    //     headerText: "cool"
    // })
    return (
        <PageLayout {...props} headerShow={false}>
            <View style={[styles.container]}>
                <Text>Hello,this is create goal</Text>
            </View>
        </PageLayout>
    )
}

export default CreateGoal;