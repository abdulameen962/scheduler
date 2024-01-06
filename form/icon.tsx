import React,{FC, isValidElement} from "react";
import {Pressable,Image,View} from "react-native"
import PropTypes from "prop-types";
import styles from "./formstyles";
import ExtraForm from "./extraForm"

const Icon:FC = (props:any) => {
    let src : String | React.ReactNode | Object;
    if (props.abled && props.icon.activeSrc) {
        src = props.icon.activeSrc;
    }
    else{
        src = props.icon.src;
    }

    let IconComponent : any;

    if (Array.isArray(src)) {
        IconComponent = [src[0]];
    }

    return (
        <View style={styles.rightIcon}>
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
                                   {
                                        !IconComponent ? (
                                            <Image
                                                style = {styles.inputIcon}
                                                source={src}
                                                {...props.icon.attributes}
                                            />     
                                        ):
                                        (
                                            <>
                                                {
                                                    IconComponent.map((extra:any,index:number) => <ExtraForm key={index}>
                                                        {extra}
                                                    </ExtraForm> )
                                                }
                                            </>
                                        )
                                   }                   
                                </Pressable>
                            )
                        }
                    </>
                ):(
                    <>
                        {
                            !IconComponent ? (
                                <Image
                                    style = {styles.inputIcon}
                                    source={src}
                                    {...props.icon.attributes}
                                />     
                            ):
                            (
                                <>
                                    {
                                        IconComponent.map((extra:any,index:number) => <ExtraForm key={index}>
                                            {extra}
                                        </ExtraForm> )
                                    }
                                </>
                            )
                        }  
                    </>
                )
            }        
        </View>
    )
}

Icon.propTypes = {
    icon: PropTypes.object.isRequired,
}

export default Icon