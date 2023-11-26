import React from "react";
import {View,Text} from 'react-native'
import ContentLoader from 'react-content-loader/native'

const MyLoader = () => <ContentLoader animate={true} />

class Home extends React.Component{
    render(){
        return (
            <>
                <MyLoader/>
                <MyLoader/>
                <MyLoader/>
            </>
        )
        // return(
        //     <View>
        //         <Text>Home</Text>
        //     </View>
        // )
    }
}


export default Home