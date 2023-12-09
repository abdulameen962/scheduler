import React from "react";
import PropTypes from "prop-types";
import { View,ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import styles from "../styles";
import Alerter from "../components/alerter";

const FormLayout = props => {

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