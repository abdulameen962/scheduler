import React,{FC} from "react"
import Label from '../components/label';
import { 
    Text,
    Heading,
    Pressable ,
    Select,
    SelectPortal,
    SelectInput,
    SelectIcon,
    Icon,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicatorWrapper,
    SelectDragIndicator,
    SelectItem,
    SelectTrigger,
    ChevronDownIcon,
    View,
  } from '@gluestack-ui/themed';

import { Image } from "react-native";
import appStyles from "../styles/appStyles";
import PropTypes from "prop-types"

const CustomSelect = ({onChange,label="Choose option",values=[],onOpen}) => {

    return (
        <View mb="$2">
            <Label text={label} />
            <Select width="$full" mt="$1" selectedLabel={label} onValueChange={onChange} onOpen={() => {
                if (onOpen) onOpen()
            }}>
                <SelectTrigger variant="underlined" size="md" paddingHorizontal="$1">
                    <SelectInput placeholder="Select option" color="$secondary500"/>
                    <SelectIcon mr="$3">
                    <Icon as={ChevronDownIcon} color="$secondary500" />
                    </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                    <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {
                        values && values.length > 0 ? values.map((goal,index) => {
                            const {title,id,click,image} = goal;
                            if (click) {
                                return (
                                    <SelectItem key={index} label={title} value={id} onPress={() => {
                                        click();
                                    }} />
                                )
                            }

                            return (
                                <View key={index} width={"100%"} paddingVertical="$1">
                                    <SelectItem label={title} value={id} />
                                    {
                                        image && (
                                            <Image
                                                source={image}
                                                alt={title}
                                                style={[appStyles.tinyImg,{position:"absolute",right:10,top:"10%",width:35,height:35}]}
                                                resizeMode="contain"
                                            />
                                        )
                                    }
                                </View>
                            )

                        }):
                        (
                            <SelectItem label="Loading..." value="loading..." isDisabled={true} />
                        )
                    }
                    </SelectContent>
                </SelectPortal>
            </Select>
        </View>
    )
}

CustomSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
}

export default CustomSelect;