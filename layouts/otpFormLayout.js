import React from "react";
import {View,Text,TouchableOpacity} from 'react-native'
import Form from "../form";
import styles from "../styles";
import { store } from "../redux/store";
import { Instagram } from 'react-content-loader/native'
import PropTypes from "prop-types"
import { connect } from 'react-redux';
import Toast from "react-native-toast-message"
import LoginHeader from '../components/loginHeader';
import FormLayout from '../layouts/formLayout';
import { trim } from "../helpfulFunc";

const MyLoader = () => <Instagram animate={true} />

class OtpFormLayout extends React.Component{
    static propTypes = {
        confirmRegisterOtp: PropTypes.func.isRequired,
        err: PropTypes.string,
        successMessage: PropTypes.string,
        resendOtpVerification: PropTypes.func.isRequired,
    }

    state = {
        formArr: null,
        err: null,
        successMessage:null,
        otp: "",
        disabled: true,
    }

    handleChange = key => val => {
        this.setState({[key]:val})
    }

    getForm = () => {
        let formArr = {
            form : [
                {
                    attributes:{
                        placeholder:"enter otp" ,
                        autoCapitalize:'none' ,
                        inputMode:'numeric' ,
                        onChangeText:this.handleChange('otp')
                    },
                    leftIcon:{
                        clickable: false,
                        src: require("../assets/otp.png"),
                        activeSrc: require("../assets/otp-active.png"),
                        attributes:{}
                    },
                },
            ],
            submit: {
                btnText: "Confirm",
                onSubmit:this.confirmVerifyOtp,
                disabled: this.state.disabled,
            },
            extras: [
                <View style={[styles.actionContainer,{paddingHorizontal:10}]}>
                    <TouchableOpacity style={[styles.forgot,{flexDirection:"row"}]} onPress={() => this.resendOtp()}>
                        <Text style={[styles.p]}>Didn't receive it?</Text>
                        <Text style={[styles.p,styles.blueText,{paddingLeft:6}]}>Resend</Text>
                    </TouchableOpacity>
                </View>
            ],
            error: this.state.err,
            sucess: this.state.successMessage
        }

        return formArr;
    }

    confirmVerifyOtp = () => {
        setTimeout(() => {
            if (this.state.disabled == false) this.props.confirmRegisterOtp(store,trim(this.state.otp));
        }, 1000);
    }

    componentDidMount(){
        let formArr = this.getForm();
        this.setState({
            formArr
        })
    }

    componentDidUpdate = (prevProps,prevState) => {
        if (prevState.otp !== this.state.otp
            ) {
            if (this.state.otp.length == 6 ) {
                this.setState({
                    disabled: false
                })
            }   
            else{
                // if (this.state.disabled == false) {
                    this.setState({
                        disabled: true,
                    })   
                // }
            }
        }

        if (this.props.err !== this.state.err) {
            this.setState({
                err: this.props.err
            })
        }

        if (this.props.successMessage !== this.state.successMessage) {
            this.setState({
                successMessage: this.props.successMessage
            })
        }

        if (prevState.disabled !== this.state.disabled || 
            prevState.err !== this.state.err || 
            prevState.successMessage !== this.state.successMessage
            ) {
            this.setState({
                formArr:this.getForm()
            })
        }
    }

    resendOtp = () => {
        Toast.show({
            type: "info",
            text1:"Resend otp request",
            text2: "You will see your new otp in a few",
            position:"top",
            visibilityTime: 5000
            // topOffset: 30,
        })
        setTimeout(() => {
            this.props.resendOtpVerification(store);
            // set state to show that it has been sent
        }, 300);
    }

    render(){
        if (this.state.formArr == null) return(<MyLoader />)
        return(
            <FormLayout>
                <LoginHeader text="Verify otp sent to you. Verify your email and move to your dashboard" />
                {
                    this.state.formArr != null && (
                        <Form {...this.state.formArr} />
                )
                }
            </FormLayout>
        )
    }
}

const mapStateToProps = (state,ownProps) => ({
    err: state.user.errMessage || null,
    successMessage: state.user.successMessage || null,
    confirmRegisterOtp: ownProps.confirmRegisterOtp,
    resendOtpVerification: ownProps.resendOtpVerification
})

export default connect(mapStateToProps)(OtpFormLayout)