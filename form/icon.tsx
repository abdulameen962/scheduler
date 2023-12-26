import React,{FC} from "react";
import {Pressable,Image} from "react-native"
import PropTypes from "prop-types";
import styles from "./formstyles";

const Icon:FC = (props:any) => {
    let src : String;
    if (props.abled && props.icon.activeSrc) {
        src = props.icon.activeSrc;
    }
    else{
        src = props.icon.src;
    }

    return (
        <>
            {
                props.icon.clickable ? (
                    <>
                        {
                            props.icon.onClick == "showpassword" ? (
                                <Pressable onPress={() => props.click()}>
                                    <Image
                                        style = {styles.inputIcon}
                                        source={props.img}
                                        {...props.icon.attributes}
                                    />                        
                                </Pressable>
                            ):
                            (
                                <Pressable onPress={props.icon.onClick}>
                                    <Image
                                        style = {styles.inputIcon}
                                        source={src}
                                        {...props.icon.attributes}
                                    />                        
                                </Pressable>
                            )
                        }
                    </>
                ):(
                    <Image
                        style = {styles.inputIcon}
                        source={src}
                        {...props.icon.attributes}
                    />         
                )
            }        
        </>
    )
}

Icon.propTypes = {
    icon: PropTypes.object.isRequired,
}

export default Icon