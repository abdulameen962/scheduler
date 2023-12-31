import React,{useState} from "react";
import { Pressable,Text } from "react-native";
import PropTypes from "prop-types"
import styles from "./formstyles"
import Toast from "react-native-toast-message";

class SubmitBtn extends React.Component {   
    state = {
        "name":null
    }

    onPress = () => {
        let submitName = "Submitting..."
        if (this.props.submit.submitName) {
            submitName = this.props.submit.submitName;
        }
        else if(this.props.submit.btnText){
            submitName = `${this.props.submit.btnText}...`;
        }
        this.setState({"name":submitName});
        Toast.show({
            type: `info`,
            text1:"Request submitted",
            text2: "Your request has been submitted,you will get a response soon",
            position:"top",
            // visibilityTime: 7000
            // topOffset: 30,
        })
        this.props.submit.onSubmit();
    }

    formChecker = () => {
        if (this.props.submit.disabled) {
            return [styles.submitBtn,styles.inactiveBtn];
        }
        return [styles.submitBtn,styles.activeBtn];
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps.err != this.props.err) {
            this.getSubmitText();
        }   
    }

    componentDidMount(){
        this.getSubmitText();
    }

    getSubmitText = () => {
        let submitBtnText = "Submit";
        if (this.props.submit.btnText) {
            submitBtnText = this.props.submit.btnText;
        }
        this.setState({"name":submitBtnText})
    }

    render(){    
        return (
            <Pressable style={this.formChecker} onPress={() =>{
                this.onPress();
            }} disabled={this.props.submit.disabled}>
                <Text style={styles.submitBtnText}>
                    {this.state.name}
                </Text>
            </Pressable>
        )
    }
}

// prop type to confirm submit is being sent to it
SubmitBtn.propTypes = {
    submit: PropTypes.object.isRequired,
}

export default SubmitBtn


