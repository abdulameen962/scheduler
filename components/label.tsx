import React from "react";
import { 
    Text,
  } from '@gluestack-ui/themed';


interface Props{
    text: string,

}

const Label = ({text}: Props) => {
    return (
        <>
            <Text color="$secondary400" marginVertical="$1" mt="$3" > {text} </Text>
        </>
    )
}

export default Label;