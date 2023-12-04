import React from "react";
import PropTypes from "prop-types"
import { View,ScrollView } from "react-native";
import styles from "../styles";
import { StatusBar } from 'expo-status-bar';

const PageLayout = props => {
    const {children} = props;

    return (
        <ScrollView contentContainerStyle={[styles.container,styles.greyBack,styles.formContainer]}>
            
            {children}
            <StatusBar style="auto" />
        </ScrollView>
    )
}

PageLayout.propTypes = {
    children: PropTypes.node.isRequired
}

export default PageLayout