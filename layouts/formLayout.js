import React from "react";
import PropTypes from "prop-types";
import { View,ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import styles from "../styles";
import Alerter from "../components/alerter";

const FormLayout = props => {
    const showToast = (type,msg) => {
        Toast.show({
            type: `${type.toLowerCase()}`,
            text1:type,
            text2: msg,
            position:"top",
            // visibilityTime: 7000
            // topOffset: 30,
        })
    }

    if (props.error) {
        showToast("Error",props.error)
    }

    if (props.sucess) {
        showToast("Success",props.sucess)
    }

    return(
        <Alerter>
            <View style={[styles.container,styles.greyBack,styles.formContainer]}>
                <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    {props.children}
                    <StatusBar style="auto" />
                </ScrollView>
            </View>
        </Alerter>
    )
}


FormLayout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default FormLayout;