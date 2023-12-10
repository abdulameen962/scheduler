import React from "react"
import PropTypes from "prop-types"
import * as Updates from 'expo-updates';
import { connect } from "react-redux";
import Toast from "react-native-toast-message";

class Alerter extends React.Component {
    // componentDidMount(){
    //     this.onFetchUpdateAsync()
    // }
    // onFetchUpdateAsync = async () => {
    //     try {
    //       const update = await Updates.checkForUpdateAsync();
    
    //       if (update.isAvailable) {
    //         await Updates.fetchUpdateAsync();
    //         await Updates.reloadAsync();
    //       }
    //     } catch (error) {
    //       // You can also add an alert() to see the error message in case of an error when fetching updates.
    //       alert(`Error fetching latest Expo update: ${error}`);
    //     }
    // }

    // showToast = (type,msg) => {
    //     Toast.show({
    //         type: `${type.toLowerCase()}`,
    //         text1:type,
    //         text2: msg,
    //         position:"top",
    //         visibilityTime: 4000
    //         // topOffset: 30,
    //     })
    // }

    // checkMessage = () => {
    //     const props = this.props;
    //     if (props.error && props.error !== null) {
    //         this.showToast("Error",props.error)
    //     }
    
    //     if (props.sucess && props.sucess !== null) {
    //         this.showToast("Success",props.sucess)
    //     }
    // }

    // componentDidMount(){
    //     this.checkMessage();
    // }

    // componentDidUpdate(prevProps,prevState){
    //     if (prevProps.error !== this.props.error && this.props.error !== null 
    //         && this.props.error !== undefined
    //     ) {
    //         this.showToast("Error",this.props.error)
    //     }
    //     else if(prevProps.sucess !== this.props.sucess && this.props.sucess !== null && this.props.sucess !== undefined){
    //         this.showToast("Success",this.props.sucess)
    //     }
    // }

    render(){
        const {children} = this.props;
        return (
            <>
                {children}
            </>
        )
    }
}

Alerter.propTypes = {
    children: PropTypes.node.isRequired,
}

const mapStateToProps = (state,ownProps) => ({
    err: state.user.errMessage || null,
    sucess: state.user.successMessage || null,
})

export default connect(mapStateToProps)(Alerter);