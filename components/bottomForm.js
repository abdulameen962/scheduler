import React from "react";
import PropTypes from "prop-types"
import {View,Text} from "react-native"
import styles from "../styles";

const FormFooter = props => {
    const {children} = props;

    return (
        <View style={{marginTop:30}}>
            <View style={[styles.orContainer]}>
                <View style={[styles.greyLine]}></View>
                <Text style={[styles.p,{paddingVertical:0,lineHeight:15}]}>Or</Text>
                <View style={[styles.greyLine]}></View>
            </View>
            {children}
        </View>
    )
}

FormFooter.propTypes = {
    children: PropTypes.node.isRequired
}

export default FormFooter



