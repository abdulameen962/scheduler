import React from "react";
import { useNavigation } from '@react-navigation/native';
import PropTypes from "prop-types"

const GetNav = props => {
    const navigation = useNavigation();
    props.setNavigation(navigation);
    return (
        <>
        </>
    )
}

GetNav.propTypes = {
    setNavigation: PropTypes.func.isRequired,
}

export default GetNav;