import React from "react";
import PageLayout from "../layouts/pageLayout";
import { userGoals,userProfile,onGoingTasks } from "../redux/actions";
import { store } from "../redux/store";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Spinner,View,Text,Pressable,Heading,Button,ButtonText } from "@gluestack-ui/themed";
import { TouchableOpacity,Dimensions,ScrollView,Image } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { truncateString } from "../helpfulFunc";
// import { Pre } from "@expo/html-elements";
import styles from "../styles";
import appStyles from "../styles/appStyles";
import {MyLoader} from "../nativeHelpers";
import { FlashList, useBlankAreaTracker } from '@shopify/flash-list'
import taskSingle from "../components/taskSingle";
import {width} from "../components/homeHeader";
import Toast from "react-native-toast-message";

class Home extends React.Component{
    static propTypes = {
        userProfile: PropTypes.func.isRequired
    }

    state = {
        profile: null,
        goals: null,
        ongoingTaks: null
    }

    getGoals = async () => {
        try{
            const result = await userGoals(store);
            const returnedData = result;
            for (let i = 0; i < returnedData.length; i++) {
                const element = returnedData[i];
                element["title"] = truncateString(element["title"],12);
                switch (i) {
                    case 0:
                        element["color"] = "rgba(219, 212, 254,.6)";
    
                        break;
    
                    case 1:
                        element["color"] = "rgba(218,255,247,.8)";
    
                        break;
    
                    case 2:
                        element["color"] = "rgba(230,242,158,.6)";
    
                        break;
                
                    default:
                        break;
                }
            }
            this.setState({
                goals: returnedData
            })
        }
        catch(e){
            Toast.show({
                type: `error`,
                text1:"Error",
                text2: `${e}`,
                position:"top",
                bottomOffset: 30,
                visibilityTime: 6000,
                // visibilityTime: 7000
                // topOffset: 30,
            })
        }

    }

    getOngoingTasks = async () => {
        try{
            const ongoingTaks = await onGoingTasks(store);
            this.setState({ongoingTaks})
        }
        catch(e){
            Toast.show({
                type: `error`,
                text1:"Error",
                text2: `${e}`,
                position:"top",
                bottomOffset: 30,
                visibilityTime: 6000,
                // visibilityTime: 7000
                // topOffset: 30,
            })
        }
    }

    updateProfile = async () => {
        await this.props.userProfile(store);
        const props = this.props;
        const {profile} = props;
        if (profile) {
            this.setState({profile});
        }
    }

    componentDidMount(){
        this.getGoals();
        this.updateProfile();
        this.getOngoingTasks();
    }

    goToDetails = (id) => {
        this.props.navigation.navigate("AddTask",{
            screen: "GoalDetail",
            params:{
                id: id,
                // refresh: true
            }
        })
    }

    componentDidUpdate(prevProps,prevState){
        const props = this.props;
        if (prevProps.profile !== this.props.profile) {
            this.updateProfile();
        }
        if (this.state.profile) {
            const {username} = this.props.profile;
            this.props.navigation.setOptions({
                headerShown: true,
                headerRight: () => 
                <Pressable 
                    onPress={() => {
                        props.navigation.navigate('Setting')
                    }}
                    mr="$5"
                    width={40}
                    rounded="$full"
                    backgroundColor={"rgba(255, 255, 255,.8)"}
                    padding="$2"
                >
                <Ionicons name="notifications-outline" color={"rgba(0,0,0,.9)"} size={25} />
            </Pressable>,
            headerLeft: () =>  
                <Heading
                    style={[{width:width/(5/4)}]}
                    ml="$5"
                >
                    Hello
                    <Heading color="$blue600"> {username}</Heading>
                </Heading>,
            })
        }
        if (prevProps != this.props) {
            const {route} = props;
            if (route) {
                if (route.params !== undefined ) {
                    const {refresh} = route.params;
            
                    if (refresh !== undefined && refresh == true) {
                        this.setState({goals:null,ongoingTaks:null})
                        this.getGoals();
                        this.getOngoingTasks();
                    }
                }   
            }
        }
    }

    render(){
        if (!this.state.profile || !this.state.goals) return (
            <PageLayout  {...this.props} headerShow={true}>
                <Spinner size="large" />
            </PageLayout>
        );
        const {username} = this.state.profile;
        return (
            <PageLayout {...this.props} headerShow={true} username={username}>
                <View style={[{width:width}]}>
                    <Heading
                        bold
                        size="2xl"
                        // pt="$4"
                        pb="$4"
                        width={200}
                    >
                        Manage Your Daily Tasks
                    </Heading>
                        {
                            this.state.goals.length > 0 ? (
                                <ScrollView contentContainerStyle={[styles.orContainer]}>
                                    <View 
                                        style={[{
                                            width: (2/5) * width
                                        },appStyles.taskLeftContainer]}
                                    >
                                        <Pressable onPress={() => this.goToDetails(this.state.goals[0].id)}>
                                            <View style={[appStyles.taskLeft,{backgroundColor:this.state.goals[0].color}]}>
                                                <View>
                                                    <Image
                                                        source={{uri:this.state.goals[0].goal_image}}
                                                        alt={this.state.goals[0].title}
                                                        style={[appStyles.tinyImg]}
                                                        resizeMode="contain"
                                                    />
                                                </View>
                                                <View>
                                                    <Heading
                                                        size="md"
                                                        bold
                                                    >
                                                        {this.state.goals[0].title}
                                                    </Heading>
                                                    <Text size="sm" pt="$1">
                                                        {this.state.goals[0].task_num} {this.state.goals[0].task_num > 1 ? "tasks": "task"}
                                                    </Text>
                                                </View>
                                            </View>
                                        </Pressable>

                                    </View>
                                    <View
                                        style={[{
                                            width: (3/5) * width
                                        },appStyles.taskRightContainer]}
                                    >
                                        {
                                            this.state.goals.length > 1 && this.state.goals.slice(-2).map((goal,index) => {
                                                if (goal !== this.state.goals[0]) {
                                                    return (
                                                        <Pressable key={index} onPress={() => this.goToDetails(goal.id)}>
                                                            <View style={[styles.orContainer,appStyles.taskRight,{backgroundColor:goal.color}]}>
                                                                <View style={[{width:"35%"}]}>
                                                                    <Image
                                                                        source={{uri:goal.goal_image}}
                                                                        alt={goal.title}
                                                                        style={[appStyles.tinyImg]}
                                                                    />
                                                                </View>
                                                                <View style={[{width:"65%"}]}>
                                                                    <Heading
                                                                        size="md"
                                                                        bold
                                                                        
                                                                    >
                                                                        {goal.title}
                                                                    </Heading>
                                                                    <Text size="sm" pt="$1">
                                                                        {goal.task_num} {goal.task_num > 1 ? "tasks" > 1 : "task"}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </Pressable>
                                                    )   
                                                }
                                                return null;
                                            })
                                        }
                                    </View>
                                </ScrollView>
                            ):
                            (
                                <>
                                    <View
                                        style={{flexDirection:"row",justifyContent:"flex-start"}}
                                    >
                                        <Text size="sm">
                                            No goals created yet, 
                                        </Text>
                                        <TouchableOpacity onPress={() => {
                                            this.props.navigation.navigate('Home',{
                                                showTask: true                                                                                                                                                                                                                                  
                                            })
                                        }}>
                                            <Text color="$blue600" size="sm">
                                                create one now
                                            </Text>
                                        </TouchableOpacity>
                                    </View>                         
                                </>
                            )
                        }

                    <View
                        mt="$5"
                        mb="$5"
                        style={[{width:"100%"}]}
                    >
                        <View
                            style={[styles.orContainer]}
                        >
                            <Heading
                                bold
                                size="xl"
                            >
                                Ongoing
                            </Heading>
                            <Pressable>
                                <Text size="md">See all</Text>
                            </Pressable>
                        </View>
                        <View
                            mt="$4"
                            mb="$4"
                            width={"100%"}
                            minHeight={40}
                        >
                            {
                                this.state.ongoingTaks ? (
                                    <>
                                        {
                                            this.state.ongoingTaks.length > 0 ? (
                                                <FlashList
                                                    data={this.state.ongoingTaks}
                                                    renderItem={taskSingle}
                                                    estimatedItemSize={8}
                                                    keyExtractor={(item) => item.id}
                                                    numColumns={1}
                                                    horizontal={false}
                                                />
                                            ):
                                            (
                                                <>
                                                    <View
                                                        style={{flexDirection:"row",justifyContent:"flex-start"}}
                                                    >
                                                        <Text size="sm">
                                                            No ongoing tasks, 
                                                        </Text>
                                                        <TouchableOpacity onPress={() => {
                                                            this.props.navigation.navigate('Home',{
                                                                showTask: true                                                                                                                                                                                                                                  
                                                            })
                                                        }}>
                                                            <Text color="$blue600" size="sm">
                                                                create one now
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>                         
                                                </>
                                            )
                                        }
                                    </>
                                ):
                                (
                                    <ScrollView>
                                        <MyLoader width={width} height={150}/>
                                        <MyLoader width={width} height={150}/>                                                                                             
                                        <MyLoader width={width} height={150}/>
                                    </ScrollView>
                                )
                            }
                            
                        </View>
                    </View>
                </View>
            </PageLayout>
        )
    }
}

const mapStateToProps = (state,ownProps) => ({
    profile: state.userProfile.profile || null
})


export default connect(mapStateToProps,{userProfile})(Home)