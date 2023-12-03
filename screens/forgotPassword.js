import React,{Component} from 'react'
import Form from '../form';
import LoginHeader from '../components/loginHeader';
import FormLayout from '../layouts/formLayout';
import { Instagram } from 'react-content-loader/native'
import { validEmailInput } from '../helpfulFunc';
import { connect } from 'react-redux';
import { sendForgotPasswordOtp } from '../redux/actions';
import { trim } from '../helpfulFunc';

const MyLoader = () => <Instagram animate={true} />

class ForgotPassword extends Component{
    state = {
        email: '',
        disabled: true,
        err:null,
        successMessage:null
    }

    componentDidUpdate = (prevProps,prevState) => {
        if (prevState.email !== this.state.email) {
            if (validEmailInput(this.state.email)) {
                this.setState({
                    disabled: false
                })
            }   
            else{
                this.setState({
                    disabled: true,
                })   
            }
        }

        if (this.props.err !== this.state.err) {
            this.setState({
                err: this.props.err,
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

    forgotPasswordFunc = async () => {
        if (this.state.disabled == false) {
            const result = await this.props.sendForgotPasswordOtp(trim(this.state.email));
            if (result) this.props.navigation.navigate('ForgotOtp')
        };
    }   

    getForm = () => {
        let formArr = {
            form : [
                {
                    attributes:{
                        placeholder:"email" ,
                        autoCapitalize:'none' ,
                        autoComplete:'email',
                        inputMode:'email' ,
                        keyboardType:'email-address',
                        onChangeText:this.handleChange('email')
                    },
                    leftIcon:{
                        clickable: false,
                        src: require("../assets/email.png"),
                        activeSrc: require("../assets/email-active.png"),
                        attributes:{}
                    },
                },
            ],
            submit: {
                btnText: "Send Otp",
                onSubmit:this.forgotPasswordFunc,
                disabled: this.state.disabled,
            },
            extras: [

            ],
            error: this.state.err,
            sucess: this.state.successMessage
        }

        return formArr;
    }

    handleChange = key => val => {
        this.setState({[key]:val})
    }

    componentDidMount = () => {
        let formArr = this.getForm();
        this.setState({
            formArr
        })
    }

    render(){
        if (this.state.formArr == null) return(<MyLoader />)
        return(
            <FormLayout>
                <LoginHeader text="Enter your email here,to get an otp sent for your password reset" />
                <Form {...this.state.formArr} />
            </FormLayout>
        )
    }
}

const mapStateToProps = (state,ownProps) => ({
    err: state.user.errMessage || null,
    successMessage: state.user.successMessage || null,
})

export default connect(mapStateToProps,{sendForgotPasswordOtp})(ForgotPassword)