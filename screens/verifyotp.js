import React from "react";
import OtpFormLayout from "../layouts/otpFormLayout";
import { resendOtpVerification,confirmRegisterOtp } from "../redux/actions";
import PropTypes from "prop-types"
import { connect } from 'react-redux';

class VerifyOtp extends React.Component{
    static propTypes = {
        updateState: PropTypes.func.isRequired,
        confirmRegisterOtp: PropTypes.func.isRequired,
        onboardDone: PropTypes.bool,
        resendOtpVerification: PropTypes.func.isRequired,
        sendNotification: PropTypes.func.isRequired,
    }

    state = {}

    static getDerivedStateFromProps(nextProps,state){
        try{
            if (nextProps.onboardDone || nextProps.onboardDone == false) {
                if (nextProps.onboardDone) {
                    let header = "Thanks for signing up";
                    let body = "Congrats on signing up,awesome awaits 🙌🎉🙌🎉";
                    nextProps.sendNotification(header,body,{url:"Setting"});
                }
                nextProps.updateState();
            }
            return null;
        }
        catch(error){
            return null;
        }
        
    }

    render(){
        return(
            <OtpFormLayout 
                confirmRegisterOtp={this.props.confirmRegisterOtp} 
                resendOtpVerification={this.props.resendOtpVerification} 
             />
        )
    }
}

const mapStateToProps = (state,ownProps) => ({
    onboardDone: state.user.onboardDone || null,
    updateState: ownProps.updateState,
    sendNotification: ownProps.sendNotification,
})

export default connect(mapStateToProps,{confirmRegisterOtp,resendOtpVerification})(VerifyOtp)