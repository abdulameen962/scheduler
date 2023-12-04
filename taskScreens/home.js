import React from "react";
import {View,Text} from 'react-native'
import ContentLoader from 'react-content-loader/native'
import PageLayout from "../layouts/pageLayout";

const MyLoader = () => <ContentLoader animate={true} />

class Home extends React.Component{
    render(){
        return (
            <PageLayout>
                <MyLoader/>
                <MyLoader/>
                <MyLoader/>
            </PageLayout>
        )
        // return(
        //     <View>
        //         <Text>Home</Text>
        //     </View>
        // )
    }
}


export default Home