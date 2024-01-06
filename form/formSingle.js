import React,{useState} from "react";
import {TextInput,Pressable,Image,View} from "react-native"
import PropTypes from "prop-types";
import styles from "./formstyles";
import { Asset } from 'expo-asset';
import Icon from "./icon";


const InputCustom = props => {
    const {CustomInput} = props;
    const Element = CustomInput;
    // nullify the input so it wont affect
    props[CustomInput] = null;

    if (Element) {
        return (
            <Element
                { ...props}
            />
        )
    }

    else{
        return (
            <TextInput
                {...props}
            />
        )
    }

}

InputCustom.propTypes = {
    CustomInput: PropTypes.object || null,
}

/***
 * To show each input
 * To add image icons,
 * add an object of left icon,for a left icon
 * and right icon for a right one
 */
class FormSingle extends React.Component{
    state = {
        abled: false,
        showPassword:null
    }

    toggleState = abled => {
        if (this.state.abled !== abled) {
            this.setState({abled})
        }
        // console.log("focused")
    }

    getStyle = () => {
        let inputStyle = this.props.input.inputStyle ? this.props.input.inputStyle : styles.inputContainer;
        let activeContainer = this.props.input.activeInput ? this.props.input.activeInput : styles.activeContainer;
        let inactiveContainer = this.props.input.activeInput ? inputStyle : styles.inactiveContainer;
        const result = [inputStyle,styles.baseContainer];
        if (this.state.abled) {
            result.push(activeContainer)
            return result;
        }
        result.push(inactiveContainer);
        return result;
    }
    
    
    getPhotos = () => {
        // check if there is lefticon and or right icon
        // if lefticon, then add lefticon.src to photos
        // if righticon, then add righticon.src to photos
        // return photos
        let photos = []
        if (this.props.input.leftIcon) {
            const {src,activeSrc} = this.props.input.leftIcon
            photos.push(src,activeSrc)
        }
        if (this.props.input.rightIcon) {
            const {src,activeSrc} = this.props.input.leftIcon
            photos.push(src,activeSrc)
        }
        return photos
    
    }
    loadAssetsAsync = async () => {
        await Asset.loadAsync(this.getPhotos())
    }
    
    componentDidMount(){
        this.loadAssetsAsync();
    }

    initializePassword = () => {
        if (this.props.input.rightIcon) {
            // console.log(this.props.input.rightIcon)
            if (this.props.input.rightIcon.onClick == "showpassword") {
                const {src,clickedImg} = this.props.input.rightIcon;
                if (!this.state.showPassword) {
                    this.setState({
                        showPassword: {
                            show: true,
                            src,
                        }
                    })       
                }
                else{
                    this.setState(prevState => ({
                        showPassword:{
                            show: !prevState.showPassword.show,
                            src: prevState.showPassword.src == src ? clickedImg: src,
                        }
                    }))
                }
            }
        }

    }

    inputArea = () => {
        const result = [styles.inputArea];
        if (this.props.input.leftIcon && !this.props.input.rightIcon) result.push({minWidth:"85%"})

        return result;
    }

    componentDidMount(){
        // console.log(this.props.rightIcon)
        this.initializePassword();
    }

    render(){
        const {CustomInput} = this.props;
        const {Label} = this.props.input;
        return (
            <View style={[{marginVertical:5}]}>
                {
                    Label && (
                        <>
                            {Label}
                        </>
                    )
                }
                <View style={this.getStyle()}>
                    {
                        this.props.input.leftIcon && (
                            <Icon
                                icon={this.props.input.leftIcon} {...this.state}
                            />
                        )
                    }
                    {
                        this.props.input.rightIcon ? (
                            <>
                                {
                                    this.props.input.rightIcon.onClick == "showpassword" && this.state.showPassword ? (
                                        <InputCustom
                                            CustomInput = {CustomInput}
                                            style={[this.inputArea(),this.props.styled]}
                                            // onKeyPress={this.toggleState(true)}
                                            onFocus={() => {
                                            this.toggleState(true)
                                            }}
                                            onBlur={() => {
                                                this.toggleState(false)
                                            }}
                                            secureTextEntry = {this.state.showPassword.show}
                                            // multiline={true}
                                            // numberOfLines={4}
                                            // onPressIn={this.toggleState(true)}
                                            // onPressOut={this.toggleState(false)}
                                            {...this.props.input.attributes}
                                        />
                                    ):
                                    (
                                        <InputCustom
                                            CustomInput = {CustomInput}
                                            style={[this.inputArea(),this.props.styled]}
                                            {...this.props.input.attributes}
                                            onFocus={() => {
                                            this.toggleState(true)
                                            }}
                                            onBlur={() => {
                                                this.toggleState(false)
                                            }}
                                        />
                                    )
                                }
                            </>
                        ):
                        (
                            <InputCustom
                                CustomInput = {CustomInput}
                                style={[this.inputArea(),this.props.styled]}
                                {...this.props.input.attributes}
                                onFocus={() => {
                                this.toggleState(true)
                                }}
                                onBlur={() => {
                                    this.toggleState(false)
                                }}
                            />
                        )
                    }
                    {
                        this.props.input.rightIcon && (
                            <>
                                {
                                    this.props.input.rightIcon.onClick == "showpassword" && this.state.showPassword ? (
                                        <Icon
                                            icon={this.props.input.rightIcon} 
                                            {...this.state}
                                            img={this.state.showPassword.src} 
                                            click={this.initializePassword}
                                        />
                                    ):
                                    (
                                        <Icon
                                            icon={this.props.input.rightIcon} {...this.state}
                                        />
                                    )
                                }
                            </>
                        )
                    }
                </View>
            </View>
        )
    }
}

FormSingle.propTypes = {
    input: PropTypes.object.isRequired,
}


export default FormSingle