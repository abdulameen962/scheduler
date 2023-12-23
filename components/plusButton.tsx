import React from 'react'
import { View, Pressable,Text,StyleSheet } from 'react-native'
import { btnColor } from '../styles';
import { greyBackground } from '../styles';

interface ButtonProp {
    children: React.ReactNode,
    onPress: () => void
}

const size = 70

const CustomPlusButton = ({children,onPress}: ButtonProp) => {
    return(
        <View style={{
            top: -30,
            justifyContent: 'center',
            alignItems: 'center',
            width:size,
            height:size,
            borderRadius: size / 2,
            zIndex: 4,
            backgroundColor: "rgba(243, 245, 247,.4)",
        }}
        >
            <Pressable
                onPress={onPress}
                style = {{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <View
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 35,
                        backgroundColor: btnColor
                    }}
                >
                    {children}
                </View>
            </Pressable>
        </View>
    )
}

export default CustomPlusButton