import React from "react";
import ContentLoader from 'react-content-loader/native'
import PageLayout from "../layouts/pageLayout";
import { userGoals,userProfile } from "../redux/actions";
import { store } from "../redux/store";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Dimensions } from "react-native";
import { Spinner,View,Text,Pressable,Heading } from "@gluestack-ui/themed";
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Pre } from "@expo/html-elements";
import styles from "../styles";

const MyLoader = () => <ContentLoader animate={true} />
const {width} = Dimensions.get('window');
class Home extends React.Component{
    static propTypes = {
        userProfile: PropTypes.func.isRequired
    }

    state = {
        profile: null
    }

    testGoal = async () => {
        const result = await userGoals(store);

    }

    getProfile = async () => { 
        const result = await this.props.userProfile(store);
    }

    updateProfile = () => {
        const props = this.props;
        const {profile} = props;
        if (profile) {
            this.setState({profile});
        }
    }

    componentDidMount(){
        // this.testGoal();
        this.getProfile();
        this.updateProfile();
    }

    componentDidUpdate(prevProps,prevState){
        if (prevProps.profile !== this.props.profile) {
            this.updateProfile();
        }
    }

    render(){
        if (!this.state.profile) return (
            <PageLayout>
                <Spinner size="large" />
            </PageLayout>
        );
        const {username} = this.state.profile;
        return (
            <PageLayout>
                <View style={[styles.orContainer,{width:width -30,}]}
                    pt='$3'
                >
                    <Heading
                        style={[{width:width/(5/4)}]}
                    >
                        Hello
                        <Heading color="$blue600"> {username}</Heading>
                    </Heading>
                    <Pressable 
                        onPress={() => {
                        this.props.navigation.navigate('Setting')
                        }}
                        rounded="$full"
                        // borderWidth={1}
                        // borderColor="$gray400"
                        backgroundColor="$secondary100"
                        padding="$2"
                        // style={[{flexDirection:"row",justifyContent:"flex-start"}]}
                    >
                        <Ionicons name="notifications-outline" color={"rgba(0,0,0,.5)"} size={25} />
                    </Pressable>
                </View>
                <Heading
                    bold
                    size="3xl"
                    pt="$4"
                    pb="$4"
                    width={250}
                >
                    Manage Your Daily Tasks
                </Heading>
                {/* <MyLoader/>
                <MyLoader/>
                <MyLoader/> */}
            </PageLayout>
        )
    }
}

const mapStateToProps = (state,ownProps) => ({
    profile: state.userProfile.profile || null
})


export default connect(mapStateToProps,{userProfile})(Home)