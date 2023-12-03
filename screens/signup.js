import React,{Component} from 'react'
import {View,Text,TouchableOpacity} from 'react-native';
import styles from '../styles';
import Proptypes from 'prop-types';
import { registerUser } from '../redux/actions';
import { connect } from 'react-redux';
import { validEmailInput } from '../helpfulFunc';
import Form from '../form';
import LoginHeader from '../components/loginHeader';
import FormLayout from '../layouts/formLayout';
import { trim } from '../helpfulFunc';
import ContentLoader, { Facebook,Instagram } from 'react-content-loader/native'
const MyLoader = () => <Instagram animate={true} />

class Signup extends Component{

    static propTypes = {
        err: Proptypes.string,
        registerDone: Proptypes.bool,
        updateState: Proptypes.func.isRequired,
    }

    state = {
        username: '',
        email: '',
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
        if (prevState.username !== this.state.username || 
            prevState.password !== this.state.password || 
            this.state.email !== prevState.email ||
            this.state.password2 !== prevState.password2
            ) {
            // console.log("it is here")
            if (trim(this.state.username).length > 4 && 
                trim(this.state.password).length > 7 && 
                this.state.password === this.state.password2 &&
                validEmailInput(trim(this.state.email))
                ) {
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

        if (prevState.disabled !== this.state.disabled || prevState.err !== this.state.err || prevState.showPassword !== this.state.showPassword) {
            this.setState({
                formArr:this.getForm()
            })
        }

    }

    handleChange = key => val => {
        this.setState({[key]:val})
    }

    startReg = async () => {
        if (this.state.disabled == false) this.props.registerUser(trim(this.state.username),trim(this.state.email),trim(this.state.password),trim(this.state.password2));
    }

    static getDerivedStateFromProps(nextProps,state){
        try{
            if (nextProps.registerDone) {
                nextProps.updateState();
            }
            return null;
        }
        catch(error){
            return null;
        }
        
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
                {
                    attributes:{
                        placeholder:"username" ,
                        autoCapitalize:'none' ,
                        autoComplete:'off' ,
                        onChangeText:this.handleChange('username')
                    },
                    leftIcon:{
                        clickable: false,
                        src: require("../assets/user.png"),
                        activeSrc: require("../assets/user-active.png"),
                        attributes:{}
                    },
                    // rightIcon:{
                    //     clickable: true,
                    //     src: "",
                    //     attributes:{},
                    //     onClick: ""
                    // }
                },
                {
                    attributes:{
                        placeholder:"password" ,
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
                        placeholder:"confirm password", 
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
                btnText: "Signup",
                onSubmit:this.startReg,
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
        if (this.state.formArr == null) return(<MyLoader />)
        return(
            <FormLayout>
                <LoginHeader text="Sign in to access your all in one task management application. Awesome awaits" />
                {
                    this.state.formArr != null && (
                        <Form {...this.state.formArr} />
                    )
                }
                <View style={styles.actionContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={{flexDirection:"row"}}>
                        <Text style={styles.p}>Already own an account?</Text>
                        <Text style={[styles.p,styles.textBg,{paddingLeft:6}]}>Login</Text>
                    </TouchableOpacity>
                </View>
            </FormLayout>
        )
    }
}

const mapStateToProps = (state,ownProps) => ({
    err: state.user.errMessage || null,
    registerDone: state.user.registerDone || null,
    updateState: ownProps.updateState,
})

export default connect(mapStateToProps,{registerUser})(Signup)