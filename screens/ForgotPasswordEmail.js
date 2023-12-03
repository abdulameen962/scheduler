import React,{Component} from "react";
import FormLayout from '../layouts/formLayout';
import LoginHeader from '../components/loginHeader';
import { changePassword } from "../redux/actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { store } from "../redux/store";
import Form from '../form';
import { trim } from "../helpfulFunc";

class ForgotPasswordEmail extends Component{

    static propTypes = {
        err: PropTypes.string,
        changePassword: PropTypes.func.isRequired,
    }

    state = {
        password: '',
        password2: '',
        disabled: true,
        err: null,
        formArr: null,
        showPassword: {
            show: true,
            src: require("../assets/eye-cancel.png"),
        }
    }

    componentDidUpdate = (prevProps,prevState) => {
        if (
            prevState.password !== this.state.password || 
            this.state.password2 !== prevState.password2
            ) {
            if (
                trim(this.state.password).length > 7 && 
                this.state.password === this.state.password2
                ) {
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
                err: this.props.err
            })
        }

        if (prevState.disabled !== this.state.disabled ||
            prevState.err !== this.state.err ||
            prevState.showPassword !== this.state.showPassword
            ) {
            this.setState({
                formArr:this.getForm()
            })
        }

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

    showPassword = () => {
        this.setState(prevState => ({
            showPassword:{
                show: !prevState.showPassword.show,
                src: prevState.showPassword.src == require("../assets/eye.png") ? require("../assets/eye-cancel.png"): require("../assets/eye.png"),
            }
        }))
    }

    changePass = async () => {
        if (this.state.disabled == false) {
            const result = await this.props.changePassword(store,trim(this.state.password));
            if (result) this.props.navigation.navigate('Login')
        };
    }

    getForm = () => {
        let formArr = {
            form : [
                {
                    attributes:{
                        placeholder:"enter new password" ,
                        autoCapitalize:'none' ,
                        autoComplete:'off' ,
                        secureTextEntry:this.state.showPassword.show,
                        onChangeText:this.handleChange('password')
                    },
                    leftIcon:{
                        clickable: false,
                        src: require("../assets/password.png"),
                        activeSrc: require("../assets/password-active.png"),
                        attributes:{}
                    },
                    rightIcon:{
                        clickable: true,
                        src: this.state.showPassword.src,
                        activeSrc: this.state.showPassword.src,
                        attributes:{},
                        onClick: this.showPassword
                    }
                },
                {
                    attributes:{
                        placeholder:"confirm new password", 
                        autoCapitalize:'none' ,
                        autoComplete:'off', 
                        secureTextEntry:true,
                        onChangeText:this.handleChange('password2')
                    },
                    leftIcon:{
                        clickable: false,
                        src: require("../assets/password.png"),
                        activeSrc: require("../assets/password-active.png"),
                        attributes:{}
                    },
                    // rightIcon:{
                    //     clickable: true,
                    //     src: "",
                    //     attributes:{},
                    //     onClick: ""
                    // }
                },
            ],
            submit: {
                btnText: "Change password",
                onSubmit:this.changePass,
                disabled: this.state.disabled,
                // submitName:"Signing up...",
            },
            extras: [

            ],
            error: this.state.err,
            boardType: "padding"
        }

        return formArr;
    }

    render(){
        return(
            <FormLayout>
                <LoginHeader text="Reset your password here" />
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
})

export default connect(mapStateToProps,{changePassword})(ForgotPasswordEmail);