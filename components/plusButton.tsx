import React from 'react'
import { View, TouchableOpacity,Text,StyleSheet } from 'react-native'

// interface ButtonProp = {

// }

const CustomPlusButton = ({children,onPress}: any) => {
    // console.log('t came')
    return(
        <TouchableOpacity
            onPress={onPress}
            style = {{
                top: -30,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <View
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 35,
                    backgroundColor: '#3E4ADE'
                }}
            >
                {children}
            </View>
        </TouchableOpacity>
    )
}

export default CustomPlusButton