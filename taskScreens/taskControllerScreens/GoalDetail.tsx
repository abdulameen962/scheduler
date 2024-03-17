import React,{useCallback,useEffect,useState} from "react";
import { View,Text } from "react-native";
import PageLayout from "../../layouts/pageLayout";

interface NavigationProps {
    setOptions: Function,
    goBack: Function,
    navigate: Function,
}

interface Props {
    navigation:NavigationProps,
    route: {params: {id: string}},
}

const GoalDetail = (props:Props) => {
    const [goalDetail,setgoalDetail] = useState<Object>();

    useCallback(async() => {
        // props.navigation.setOptions({
        //     title: "Goal Detail",
        // })
    }, [])


    return (
        <PageLayout {...props} headerShow={true} addPadding={true}>
            <Text>{props.route.params.id} is the one for the goal</Text>
        </PageLayout>
    )
}

export default GoalDetail;