import React from "react";
import PropTypes from "prop-types"
import { View,ScrollView } from "react-native";
import styles from "../styles";
import { StatusBar } from 'expo-status-bar';
import Alerter from "../components/alerter";

const PageLayout = props => {
    const {children} = props;

    return (
        <Alerter>
            <View style={[styles.container,styles.greyBack]}>
                <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    {children}
                    <StatusBar style="auto" />
                </ScrollView>
            </View>
        </Alerter>
    )
}

PageLayout.propTypes = {
    children: PropTypes.node.isRequired
}

export default PageLayout