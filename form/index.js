import React from "react"
import {KeyboardAvoidingView,Text} from "react-native"
import styles from "./formstyles"
import PropTypes from "prop-types"
import ExtraForm from "./extraForm"
import FormSingle from "./formSingle"
import SubmitBtn from "./submitBtn"
import Toast from "react-native-toast-message"

/***
 * Form component to be able to create forms
 * @param props
 * @returns {object}
 */
const Form = props => {
    const showToast = (type,msg) => {
        Toast.show({
            type: `${type.toLowerCase()}`,
            text1:type,
            text2: msg,
            position:"top",
            // visibilityTime: 7000
            // topOffset: 30,
        })
    }

    if (props.error) {
        showToast("Error",props.error)
    }

    if (props.sucess) {
        showToast("Success",props.sucess)
    }

    return (
        <KeyboardAvoidingView behavior={props.boardType?props.boardType:"height"} style={styles.formContainer}> 
            {
                props.form && props.form.length > 0 && (
                    <>
                        {
                            props.form.map((input,index) => <FormSingle input={input} key={index} /> )
                        }
                    </>
                )
            }
            {
                props.extras && props.extras.length > 0 ? (
                    <>
                        {
                            props.extras.map((extra,index) => <ExtraForm key={index}>
                                {extra}
                            </ExtraForm> )
                        }
                    </>
                ):null
            }
            <SubmitBtn
                submit={props.submit} err={props.error}
            />
        </KeyboardAvoidingView>
    )
}

Form.propTypes = {
    form: PropTypes.array.isRequired,
    submit: PropTypes.object.isRequired,
    extras: PropTypes.array,
    error: PropTypes.string
}

export default Form

