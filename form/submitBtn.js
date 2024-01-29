import React,{useState} from "react";
import { Pressable,Text,Modal,ActivityIndicator,View } from "react-native";
import PropTypes from "prop-types"
import styles from "./formstyles"
import Toast from "react-native-toast-message";

const PageLoader = props => {
    const {loading} = props;
    if (loading) {
        return (
            <Modal 
                visible={loading}
                transparent
                animationType="fade"
            >
                <View style={styles.loaderStyles}>
                    <ActivityIndicator animating={loading} size="large" color={"#0077E6"} />
                </View>
            </Modal>
        )
    }
    return null
}

PageLoader.propTypes = {
    loading: PropTypes.bool.isRequired,
}

class SubmitBtn extends React.Component {   
    state = {
        name:null,
        loading: false,
        disabled:true,
    }

    showLoader = (loading) => {
        this.setState({loading,disabled: !loading})
    }

    onPress = async () => {
        let submitName = "Submitting..."
        if (this.props.submit.submitName) {
            submitName = this.props.submit.submitName;
        }
        else if(this.props.submit.btnText){
            submitName = `${this.props.submit.btnText}...`;
        }
        this.setState({name:submitName});
        Toast.show({
            type: `info`,
            text1:"Request submitted",
            text2: "Your request has been submitted,you will get a response soon",
            position:"top",
            // visibilityTime: 7000
            // topOffset: 30,
        });
        this.showLoader(true);
        await this.props.submit.onSubmit();
        this.getSubmitText();
        this.showLoader(false);
    }

    formChecker = () => {
        if (this.state.disabled) {
            return [styles.submitBtn,styles.inactiveBtn];
        }
        return [styles.submitBtn,styles.activeBtn];
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps.err != this.props.err) {
            this.getSubmitText();
        }   
        if (prevProps.submit.disabled !== this.props.submit.disabled) this.setState({disabled:this.props.submit.disabled})
    }

    componentDidMount(){
        this.getSubmitText();
        this.setState({disabled:this.props.submit.disabled})
    }

    getSubmitText = () => {
        let submitBtnText = "Submit";
        if (this.props.submit.btnText) {
            submitBtnText = this.props.submit.btnText;
        }
        this.setState({name:submitBtnText})
    }

    render(){    
        return (
            <>
                <Pressable style={this.formChecker} onPress={() =>{
                    this.onPress();
                }} disabled={this.state.disabled}>
                    <Text style={styles.submitBtnText}>
                        {this.state.name}
                    </Text>
                </Pressable>
                <PageLoader loading={this.state.loading} />
            </>
        )
    }
}

// prop type to confirm submit is being sent to it
SubmitBtn.propTypes = {
    submit: PropTypes.object.isRequired,
}

export default SubmitBtn


