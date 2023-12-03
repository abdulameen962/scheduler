import React from "react";
import OtpFormLayout from "../layouts/otpFormLayout";
import { sendForgotPasswordOtp,confirmForgotPasswordOtp } from "../redux/actions";
import PropTypes from "prop-types"
import { connect } from 'react-redux';

class ForgotOtp extends React.Component {
    static propTypes = {
        confirmForgotPasswordOtp: PropTypes.func.isRequired,
        sendForgotPasswordOtp: PropTypes.func.isRequired,
    }

    resendOtpVerification = async store => {
        console.log("it is at resend")
        await this.props.sendForgotPasswordOtp(null,store);
    }

    confirmForgotPasswordOtp = async (store,otp) => {
       const response = await this.props.confirmForgotPasswordOtp(otp);
       if (response) this.props.navigation.navigate("ForgotPasswordEmail");
    }

    render() {
        return(
            <OtpFormLayout 
                confirmRegisterOtp={this.confirmForgotPasswordOtp} 
                resendOtpVerification={this.resendOtpVerification} 
            />
        );
  }
}

const mapStateToProps = (state,ownProps) => ({

})

export default connect(mapStateToProps,{confirmForgotPasswordOtp,sendForgotPasswordOtp})(ForgotOtp)