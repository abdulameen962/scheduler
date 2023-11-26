import React from "react";
import PropTypes from "prop-types"
import { View,Text } from "react-native";
import styles from "../styles";

const LoginHeader = props => (
    <View style={[{
        width: "100%"
    }]}>
        <Text style={[styles.header1,styles.textBg]}>Welcome</Text>
        <Text style={[styles.header1]}>back!</Text>
        <Text style={[styles.p,styles.greyColor]}>
            {props.text}
        </Text>
    </View>
)

LoginHeader.propTypes ={
    text: PropTypes.string.isRequired,
}

export default LoginHeader