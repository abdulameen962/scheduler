import React from "react";
import { TouchableOpacity,Text,View } from "react-native";
import styles from "../styles";
import { connect } from "react-redux";
import { logUserOut } from "../redux/actions";
import PropTypes from "prop-types";
import PageLayout from "../layouts/pageLayout";

class Setting extends React.Component {
    static propTypes = {
        updateState: PropTypes.func.isRequired,
        onboardDone: PropTypes.bool.isRequired,
        logUserOut: PropTypes.func.isRequired
    }

    state = {

    }

    removeUser = () => {
         this.props.logUserOut();
    }

    static getDerivedStateFromProps(nextProps,state){
        try{
            if (nextProps.onboardDone == false) {
                nextProps.updateState();
            }
            return null;
        }
        catch(error){
            return null;
        }
        
    }

    render(){
        // console.log(this.props)
        return (
            <PageLayout>
                <TouchableOpacity onPress={this.removeUser}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </PageLayout>
        )
    }
}

const mapStateToProps = (state,ownProps) => ({
    onboardDone: state.user.onboardDone || false,
    updateState: ownProps.updateState,
})

export default connect(mapStateToProps,{logUserOut})(Setting)
