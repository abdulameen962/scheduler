import React from "react";
import { TouchableOpacity,Text,View } from '@gluestack-ui/themed';
import styles from "../styles";
import { connect } from "react-redux";
import { logUserOut } from "../redux/actions";
import { store } from "../redux/store";
import PropTypes from "prop-types";
import PageLayout from "../layouts/pageLayout";
import PopUp from "../components/popUp";

class Setting extends React.Component {
    static propTypes = {
        updateState: PropTypes.func.isRequired,
        onboardDone: PropTypes.bool.isRequired,
        logUserOut: PropTypes.func.isRequired
    }

    state = {
        // state: false
    }

    removeUser = async () => {
        await this.props.logUserOut(store);
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
        return (
            <PageLayout {...this.props}>
                <PopUp
                    header={"Logout"}
                    text={"Are you sure you want to logout?"}
                    action={"Logout"}
                    onSubmit={this.removeUser}
                    triggerElement={<Text style={{color:"white"}}>Logout</Text>}
                    positive={false}
                />
                {/* <TouchableOpacity onPress={() => this.setState({state:true})}>
                    <Text>Logout</Text>
                </TouchableOpacity> */}
            </PageLayout>
        )
    }
}

const mapStateToProps = (state,ownProps) => ({
    onboardDone: state.user.onboardDone || false,
    updateState: ownProps.updateState,
})

export default connect(mapStateToProps,{logUserOut})(Setting)
