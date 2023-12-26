import React,{Component} from 'react'
import {View,Text,TouchableOpacity,Switch, ScrollView} from 'react-native';
import styles from '../styles';
import Proptypes from 'prop-types';
import { loginUser } from '../redux/actions';
import { connect } from 'react-redux';
import Form from '../form';
import FormLayout from '../layouts/formLayout';
import LoginHeader from '../components/loginHeader';
import { trim } from '../helpfulFunc';
import GoogleComponent from '../components/googleSignin';
import FormFooter from '../components/bottomForm';

class Login extends Component{
    static propTypes = {
        err: Proptypes.string,
        onboardDone: Proptypes.bool.isRequired,
        loginUser: Proptypes.func.isRequired,
        updateState: Proptypes.func.isRequired,
        email: Proptypes.string,
    }

    state = {
        username: '',
        password: '',
        disabled: true,
        formArr: null,
        err: null,
    }

    submitForm = async () => {
        if (this.state.disabled == false) await this.props.loginUser(trim(this.state.username),trim(this.state.password));
    }

    getForm = () => {
        let formArr = {
            form : [
                {
                    attributes:{
                        placeholder:"username" ,
                        autoCapitalize:'none' ,
                        autoComplete:'off' ,
                        onChangeText:this.handleChange('username')
                    },
                    leftIcon:{
                        clickable: false,
                        src: require("../assets/email.png"),
                        activeSrc: require("../assets/email-active.png"),
                        attributes:{}
                    },
                },
                {
                    attributes:{
                        placeholder:"password" ,
                        autoCapitalize:'none' ,
                        autoComplete:'off' ,
                        // secureTextEntry:this.state.showPassword.show,
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
                        src: require("../assets/eye-cancel.png"),
                        activeSrc: require("../assets/eye-cancel.png"),
                        attributes:{},
                        onClick: "showpassword",
                        clickedImg: require("../assets/eye.png"),
                    }
                },
            ],
            submit: {
                btnText: "Login",
                onSubmit:this.submitForm,
                disabled: this.state.disabled,
            },
            extras: [
                <View style={[styles.actionContainer,{paddingHorizontal:10}]}>
                    {/* <Switch onValueChange={} value={false} /> */}
                    <TouchableOpacity style={styles.forgot} onPress={() => this.props.navigation.navigate('Forgot')}>
                        <Text style={[styles.p,styles.blueText]}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
            ],
            error: this.state.err
        }

        return formArr;
    }

    componentDidUpdate = (prevProps,prevState) => {
        if (prevState.username !== this.state.username || prevState.password !== this.state.password) {
            if (trim(this.state.username).length >= 4 && trim(this.state.password).length >= 8) {
                this.setState({
                    disabled: false,
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
                err: this.props.err,
            })
        }
        if (prevState.disabled !== this.state.disabled || prevState.err !== this.state.err || prevState.showPassword !== this.state.showPassword) {
            this.setState({
                formArr:this.getForm()
            })
        }
    }

    componentDidMount = () => {
        let formArr = this.getForm();
        this.setState({
            formArr
        })
    }

    handleChange = key => val => {
        this.setState({[key]:val})
    }

    static getDerivedStateFromProps(nextProps,state){
        try{
            if (nextProps.onboardDone || nextProps.email) {
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
            <FormLayout>
                <LoginHeader text="Sign in to access your all in one task management application. Awesome awaits" />
                {
                    this.state.formArr != null && (
                        <Form {...this.state.formArr} />
                    )
                }
                <FormFooter>
                    <View style={[styles.boxContainer]}>
                        <GoogleComponent name="Login" />
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')} style={{flexDirection:"row",justifyContent:"center"}}>
                            <Text style={styles.p}>Don't have an account?</Text>
                            <Text style={[styles.p,styles.textBg,{paddingLeft:6}]}>Create an account</Text>
                        </TouchableOpacity>
                    </View>
                </FormFooter>
            </FormLayout>
        )
    }
}

const mapStateToProps = (state,ownProps) => ({
    err: state.user.errMessage || null,
    updateState: ownProps.updateState,
    onboardDone: state.user.onboardDone || false,
    email: state.user.email || null,
})

export default connect(mapStateToProps,{loginUser})(Login)